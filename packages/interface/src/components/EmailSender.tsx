import { MessagePayload } from "@iases3/iframe-service/src/iframe-service";
import React, { useEffect, useRef, useState } from "react";
import { Email } from "../types/modelTypes";
import { ContactI3C, LogMessageOptions } from "../types/typesI3C";
import { defaultRandomWindow, fullProgressBarDelay, zeroWidtSpace } from "../constants/constants";
import { useStoreActions, useStoreState } from "../hooks/storeHooks";
import { useContactList } from "../hooks/useContactList";
import { useEmailOptions } from "../hooks/useEmailOptions";
import { useUpdateSendingStats } from "../hooks/useUpdateSendingStats";
import { getSessionFinishedText } from "../helpers/getSessionFinishedText";
import { storeActiveContacts } from "../helpers/indexedDB";
import { renderEmail } from "../helpers/renderEmail";
import { getLogsToDisplay, logSendingMessage } from "../helpers/sendingLog";
import { checkForDangelingSession, clearSessionState, updateSessionState } from "../helpers/sessionState";
import { waitRandomSeconds } from "../helpers/waitRandomSeconds";
import ButtonEndSession from "./ButtonEndSession";
import ButtonSendEmails from "./ButtonSendEmails";
import ButtonStopSending from "./ButtonStopSending";
import Dialog from "./Dialog";
import EmailOptions from "./EmailOptions";
import EmailPreview from "./EmailPreview";
import Header from "./Header";
import SelectNations from "./SelectNations";
import SendingLog from "./SendingLog";
import SendingProgress from "./SendingProgress";
import "./EmailSender.css";

const EmailSender = () => {
    const [message, setMessage] = useState<string>(zeroWidtSpace); // zeroWidtSpace used to keep styling consistent
    const [isSending, setIsSending] = useState(false);
    const [sendingLog, setSendingLog] = useState<string[]>([]);

    const userDialog = useStoreState((state) => state.userDialog);
    const forcedRender = useStoreState((state) => state.render.forcedRender);

    const sendEmail = useStoreActions((actions) => actions.sendEmail);
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

    const logMessage = (message: string, options?: LogMessageOptions) => {
        logSendingMessage(message, { setFn: setSendingLog, ...options });
    };

    useEffect(() => {
        console.log(`Updating sendingLog after reset on render #${forcedRender}`);
        async function readLog() {
            await checkForDangelingSession();
            const logsToDisplay = await getLogsToDisplay();
            setSendingLog(logsToDisplay);
        }

        void readLog();
    }, [forcedRender]);

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
                logMessage(message, { addNewline: true });
                clearSessionState();
                checkInProgress.current = false;
                setEmailsSent(0);
                setEndSession(false);
                const messageReady = `${message} Ready to start new session!`;
                setMessage(messageReady);
            }
        }
        void checkIfSessionFinished();
    }, [emailsSent, endSession, setEmailsSent, setEndSession, selectedNationsChangedSinceLastSending]);

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
    }, []);

    async function onClickSendEmail(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        if (!selectedSubject) {
            setMessage("Please select or enter a subject");
            return false;
        }

        setIsSending(true);
        setMessage("Sending emails...");

        const contactsToSendTo = selectedContactsNotSent.slice(0, maxCount - emailsSent);

        selectedNationsAtSendTime.current = selectedNations;

        for await (const contact of contactsToSendTo) {
            const logContact = `${contact.n} - ${contact.e}`;

            try {
                if (controller.current.signal.aborted) {
                    controller.current = new AbortController();
                    await waitRandomSeconds(fullProgressBarDelay / 2, 0);
                    break;
                }

                await prepareAndSendEmail(contact);

                contact.sd = Date.now();
                contact.sc++;
                setContact(contact); // Update the contact in state
                await storeActiveContacts(contact); // Update the contact in indexedDB
                logMessage(`Email sent to ${logContact}`);

                const _delay = leftToSendCount.current > 1 ? delay : fullProgressBarDelay;
                const randomWindow = leftToSendCount.current > 1 ? defaultRandomWindow : 0;

                // Important to update session state before the the wait
                setEmailsSent((count) => {
                    const newCount = ++count;
                    updateSessionState(newCount, _delay);
                    return newCount;
                });

                await waitRandomSeconds(_delay, randomWindow, { signal: controller.current.signal });
            } catch (error) {
                console.warn("*Debug* -> EmailSender.tsx -> handleSendEmails -> error:", error);
                logMessage(`Failed to send email to ${logContact}`);
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

        await sendEmail({ email, sendmode: "now" });
    };

    const onClickEndSession = () => {
        setEndSession(true);
        setMessage("Session ended by user...");
    };

    const onClickStop = () => {
        controller.current.abort();
        setMessage("Sending stopped by user...");
    };

    const sendButtonDisabled =
        isSending ||
        endSession === true ||
        controller.current.signal.aborted ||
        checkInProgress.current ||
        !selectedContactsNotSent.length;

    const stopButtonDisabled =
        leftToSendCount.current === 0 ||
        emailsSent === 0 ||
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

                {message && <p>{message}</p>}

                <div className="container_buttons">
                    {!isSending && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            {emailsSent > 0 && !endSession && !checkInProgress.current && (
                                <ButtonEndSession onClick={onClickEndSession} />
                            )}
                            <ButtonSendEmails
                                checkInProgress={checkInProgress.current}
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

            <SendingLog logMessages={sendingLog} />
        </div>
    );
};

export default EmailSender;
