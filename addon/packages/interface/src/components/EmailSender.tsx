import React, { useEffect, useRef, useState } from "react";
import type { Email, MessagePayload, ProjectEnvProps, StatusBackend } from "../types/types";
import type { ContactI3C } from "../types/typesI3C";
import { ERROR_ENVIRONMENT_UNKNOWN, defaultRandomWindow, fullProgressBarDelay } from "../constants/constants";
import { useContactList } from "../hooks/useContactList";
import { useEmailOptions } from "../hooks/useEmailOptions";
import { useUpdateSendingStats } from "../hooks/useUpdateSendingStats";
import { getSessionFinishedText } from "../helpers/getSessionFinishedText";
import { storeActiveContacts } from "../helpers/indexedDB";
import { renderEmail } from "../helpers/renderEmail";
import { checkForDangelingSession, clearSessionState, updateSessionState } from "../helpers/sessionState";
import { waitRandomSeconds } from "../helpers/waitRandomSeconds";
import { useStoreActions, useStoreState } from "../store/store";
import ButtonEndSession from "./ButtonEndSession";
import ButtonSendEmails from "./ButtonSendEmails";
import ButtonStopSending from "./ButtonStopSending";
import Dialog from "./Dialog";
import EmailOptions from "./EmailOptions";
import EmailPreview from "./EmailPreview";
import ErrorMessage from "./ErrorMessage";
import Header from "./Header";
import Message from "./Message";
import SelectNations from "./SelectNations";
import SendingLog from "./SendingLog";
import SendingProgress from "./SendingProgress";
import "./EmailSender.css";

/**
 * - The EmailSender component is universal and used by both addon and webapp
 */
function EmailSender({ environment, sendEmailFn, sendEmailPreflightFn }: ProjectEnvProps) {
    if (environment === "unknown") throw new Error(ERROR_ENVIRONMENT_UNKNOWN);

    const addLogItem = useStoreActions((state) => state.sendingLog.addLogItem);

    const message = useStoreState((state) => state.userMessage.message);
    const setMessage = useStoreActions((actions) => actions.userMessage.setMessage);

    const [prefilghtInProgess, setPrefilghtInProgess] = useState(false);
    const [emailsUnsubbed, setEmailsUnsubbed] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isSending, setIsSending] = useState(false);

    const userDialog = useStoreState((state) => state.userDialog);
    const userEmail = useStoreState((state) => state.auth.currentLogin.userEmail);

    const controller = useRef(new AbortController());

    const countryCodeRef = useRef("");
    countryCodeRef.current = useStoreState((state) => state.emailOptions.countryCode);

    useUpdateSendingStats(isSending);

    const {
        emailsSent,
        endSession,
        maxCount,
        maxSelectedContactsNotSent,
        nextContactNotSent,
        selectedContactsNotSent,
        selectedNations,
        setEmailsSent,
        setEndSession,
        setContact,
    } = useContactList();

    const { delay, EmailComponent, selectedSubject } = useEmailOptions();

    useEffect(() => {
        void checkForDangelingSession();
    }, []);

    const leftToSendCount = useRef(0);
    const remainingCountSession = Math.max(0, maxCount - (emailsSent + emailsUnsubbed));
    leftToSendCount.current = selectedContactsNotSent.slice(0, remainingCountSession).length;

    const checkInProgress = useRef(false);
    const selectedNationsAtSendTime = useRef<string[]>([]);
    const selectedNationsChangedSinceLastSending = selectedNationsAtSendTime.current !== selectedNations;
    useEffect(() => {
        async function checkIfSessionFinished() {
            if (
                emailsSent > 0 &&
                !checkInProgress.current &&
                (endSession || (leftToSendCount.current === 0 && !selectedNationsChangedSinceLastSending))
            ) {
                checkInProgress.current = true;
                await waitRandomSeconds(fullProgressBarDelay, 0); // Let progressbar stay at 100% for a few seconds
                const message = getSessionFinishedText(emailsSent);
                setMessage(message);
                addLogItem({ message, addNewline: true });
                clearSessionState();
                checkInProgress.current = false;
                setEmailsSent(0);
                setEndSession(false);
                const messageReady = `${message} Ready to start new session!`;
                setMessage(messageReady);
            }
        }
        void checkIfSessionFinished();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        emailsSent,
        leftToSendCount.current, // Needed to execute useEffect if the last email didn't increment emailsSent (failed for some reason)
        endSession,
        setEmailsSent,
        setEndSession,
        selectedNationsChangedSinceLastSending,
        addLogItem,
        setMessage,
    ]);

    useEffect(() => {
        const handleEmailStatus = (e: MessageEvent<MessagePayload>) => {
            const message = e.data || {};

            // sendEmailStatus.headerMessageId is null when sending failed or was cancelled
            if (message.type === "SEND_EMAIL_STATUS" && message.data?.sendEmailStatus?.headerMessageId === null) {
                controller.current.abort();
                setMessage(
                    "The last email failed to send or was canceled. If it failed, please check your internet connection."
                );
            }
        };

        window.addEventListener("message", handleEmailStatus);

        return () => {
            window.removeEventListener("message", handleEmailStatus);
        };
    }, [setMessage]);

    async function onClickSendEmail(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        if (!selectedSubject) {
            setMessage("Please select or enter a subject");
            return;
        }

        if (sendEmailPreflightFn) {
            setPrefilghtInProgess(true);
            const result = await sendEmailPreflightFn();
            setPrefilghtInProgess(false);

            if (result.status === "ERROR" && result.message) {
                setMessage(result.message);
                return;
            }
        }

        setIsSending(true);
        setErrorMessage("");
        setMessage("Sending emails, please wait...");
        await waitRandomSeconds(fullProgressBarDelay / 2, 0);

        const contactsToSendTo = selectedContactsNotSent.slice(0, maxCount - emailsSent);

        selectedNationsAtSendTime.current = selectedNations;

        const countryCodeAtSessionStart = countryCodeRef.current;

        for await (const contact of contactsToSendTo) {
            const logContact = `${contact.n} - ${contact.e}`;

            try {
                if (controller.current.signal.aborted || countryCodeAtSessionStart !== countryCodeRef.current) {
                    // Public IP changed during sending session, usually after connecting to a different VPN server.
                    if (countryCodeAtSessionStart !== countryCodeRef.current) {
                        setEndSession(true);
                        setErrorMessage(
                            "Session was ended because the public IP address and therefore the country code changed. Please check that you are connected to a VPN server in the country you want listed."
                        );
                        break;
                    }

                    // User stopped the session or sending of email to current contact failed, so breaking out of the for loop
                    await waitRandomSeconds(fullProgressBarDelay / 2, 0);
                    controller.current = new AbortController();
                    setIsSending(false);
                    break;
                }

                const sendResult = await prepareAndSendEmail(contact);

                if (sendResult.status === "UNSUBBED") {
                    await waitRandomSeconds(1, 0); // Short delay to ensure unsub message is readable
                    continue;
                }

                if (sendResult.status === "OK") {
                    const _delay = leftToSendCount.current > 1 ? delay : fullProgressBarDelay;
                    const randomWindow = leftToSendCount.current > 1 ? defaultRandomWindow : 0;

                    // State emailsSent needs to be updated before setContact (to awoid flickering of progressbar max) and waitRandomSeconds
                    setEmailsSent((count) => {
                        const newCount = ++count;
                        updateSessionState(newCount, _delay);
                        return newCount;
                    });

                    contact.sd = Date.now();
                    contact.sc++;
                    setContact(contact); // Update the contact in state
                    await storeActiveContacts(contact); // Update the contact in indexedDB
                    addLogItem({ message: `Email sent to ${logContact}` });

                    await waitRandomSeconds(_delay, randomWindow, { signal: controller.current.signal });
                }
            } catch (error) {
                console.warn("Error in onClickSendEmail:", error);
                addLogItem({ message: `Failed to send email to ${logContact}` });
            }
        }

        setIsSending(false);
    }

    const prepareAndSendEmail = async (contact: ContactI3C): Promise<StatusBackend | { status: "UNSUBBED" }> => {
        const emailText = renderEmail(EmailComponent, { name: contact.n });

        const email: Email = {
            to: contact.e,
            subject: selectedSubject,
            body: emailText,
        };

        if (environment === "webapp") {
            email.uid = contact.uid;
            email.from = userEmail;
        }

        // Thunderbird addon always returns undefined
        // The webapp returns a status including a message to display to the user
        const result = await sendEmailFn(email);

        if (result && result.httpStatus === 410) {
            contact.cf1 = "u";
            await storeActiveContacts(contact); // Update the contact in indexedDB

            const message = `Recipient ${contact.e} has unsubscribed`;
            setMessage(message);
            addLogItem({ message });
            setEmailsUnsubbed((count) => count + 1);

            return { status: "UNSUBBED" };
        }

        if (result?.message) setMessage(result.message);

        // Return OK for addon since result will always be undefined
        return result || { status: "OK" };
    };

    const onClickEndSession = () => {
        setEndSession(true);
        setMessage("Session ended by user...");
    };

    const onClickStop = () => {
        controller.current.abort();
        setMessage("Sending stopped by user...");
    };

    const isBusy = isSending || endSession || controller.current.signal.aborted || checkInProgress.current;

    const showErrorMessage = errorMessage && !isBusy;

    const sendButtonDisabled = isBusy || prefilghtInProgess || !selectedContactsNotSent.length;

    const stopButtonDisabled =
        leftToSendCount.current === 0 ||
        (emailsSent === 0 && environment === "addon") ||
        controller.current.signal.aborted ||
        checkInProgress.current;

    return (
        <div className="container_email_sender">
            <Header />
            <br />

            {userDialog.isOpen && (
                <Dialog
                    title={userDialog.title}
                    message={userDialog.message}
                    confirmActionText={userDialog.confirmActionText}
                    isOpen={userDialog.isOpen}
                    onClose={userDialog.onClose}
                    onConfirm={userDialog.onConfirm}
                    showConfirmationModal={userDialog.showConfirmationModal}
                    maxWidth={userDialog.maxWidth}
                />
            )}

            <div className="container_options_and_preview">
                <div className="container_options">
                    <div className="column_options_left">
                        <SelectNations selectedContactsNotSent={selectedContactsNotSent} isSending={isSending} />
                    </div>
                    <br />

                    <div className="column_options_right">
                        <EmailOptions isSending={isSending} />
                    </div>
                    <br />
                </div>

                {showErrorMessage && <ErrorMessage errorMessage={errorMessage} />}
                {<Message message={message} />}

                <div className="container_buttons">
                    {!isSending && (
                        <div className="container_buttons_not_issending">
                            {emailsSent > 0 && !endSession && !checkInProgress.current && (
                                <ButtonEndSession onClick={onClickEndSession} />
                            )}
                            <ButtonSendEmails
                                checkInProgress={checkInProgress.current}
                                preflightInProgress={prefilghtInProgess}
                                disabled={sendButtonDisabled}
                                endSession={endSession}
                                leftToSendCount={leftToSendCount.current}
                                onClick={onClickSendEmail}
                            />
                        </div>
                    )}

                    {isSending && (
                        <ButtonStopSending
                            aborted={controller.current.signal.aborted}
                            checkInProgress={checkInProgress.current}
                            disabled={stopButtonDisabled}
                            onClick={onClickStop}
                            toSendCount={leftToSendCount.current}
                        />
                    )}
                </div>

                <SendingProgress
                    maxSelectedContactsNotSent={maxSelectedContactsNotSent}
                    selectedContactsNotSent={selectedContactsNotSent}
                />

                <div className="container_email_preview">
                    <EmailPreview Component={EmailComponent} name={nextContactNotSent.n} />
                </div>
            </div>

            <SendingLog />
        </div>
    );
}

export default EmailSender;
