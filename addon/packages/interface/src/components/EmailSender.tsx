import React, { useEffect, useRef, useState } from "react";
import type { Email, MessagePayload, ProjectEnvProps } from "../types/types";
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

    const setMessage = useStoreActions((actions) => actions.userMessage.setMessage);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isSending, setIsSending] = useState(false);
    const [prefilghtInProgess, setPrefilghtInProgess] = useState(false);

    const userDialog = useStoreState((state) => state.userDialog);
    const countryCodeRef = useRef("");
    countryCodeRef.current = useStoreState((state) => state.emailOptions.countryCode);

    const addLogItem = useStoreActions((state) => state.sendingLog.addLogItem);

    const controller = useRef(new AbortController());

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
    const remainingCountSession = Math.max(0, maxCount - emailsSent);
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
    }, [
        emailsSent,
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
                    "Sending of the last email failed or was cancelled by user, if it failed please make sure you are online."
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

            if (result.status === "ERROR") {
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
                    // User stopped the session or sending of email to current contact failed, so breaking out of loop
                    controller.current = new AbortController();
                    await waitRandomSeconds(fullProgressBarDelay / 2, 0);
                    break;
                }

                await prepareAndSendEmail(contact);

                // Don't count and log email as sent for webapp when signal has been aborted, e.g. if backend is down.
                // For addon the compose email window will still be open and could be sent manually, so logging email as sent.
                // This is described in the docs. To unify the behaviour, close the email compose window programatically.
                if (controller.current.signal.aborted && environment === "webapp") {
                    await waitRandomSeconds(fullProgressBarDelay / 2, 0);
                    controller.current = new AbortController();
                    setIsSending(false);
                    break;
                }

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
            } catch (error) {
                console.warn("Error in onClickSendEmail:", error);
                addLogItem({ message: `Failed to send email to ${logContact}` });
            }
        }

        setIsSending(false);
    }

    const prepareAndSendEmail = async (contact: ContactI3C) => {
        const emailText = renderEmail(EmailComponent, { name: contact.n });
        const email: Email = {
            to: contact.e,
            subject: selectedSubject,
            body: emailText,
        };

        // Thunderbird addon always return undefined
        // webapp returns status including a message to display to the user
        const status = await sendEmailFn(email);
        if (status?.message) setMessage(status.message);
        if (status?.error) controller.current.abort();
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
                {<Message />}

                <div className="container_buttons">
                    {!isSending && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
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
