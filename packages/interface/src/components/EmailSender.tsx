import React, { useEffect, useRef, useState } from "react";
import { __DEV__, SINGLE_CONTACT_MODE } from "../constants/constants";
import { saveLocalContacts } from "../helpers/contacts";
import { removeLocalStorageItem } from "../helpers/localStorageHelpers";
import { renderEmail } from "../helpers/renderEmail";
import { readSendingLog, storeSendingLog } from "../helpers/sendingLog";
import { validateEmail } from "../helpers/validateEmail";
import { waitRandomSeconds } from "../helpers/waitRandomSeconds";
import { useStoreActions } from "../hooks/storeHooks";
import { useContactList } from "../hooks/useContactList";
import { useEmailOptions } from "../hooks/useEmailOptions";
import { useSingleContact } from "../hooks/useSingleContact";
import { Email } from "../types/modelTypes";
import { ContactI3C } from "../types/typesI3C";
import ButtonSendEmail from "./ButtonSendEmail";
import EmailOptions from "./EmailOptions";
import EmailPreview from "./EmailPreview";
import "./EmailSender.css";
import EmailsSentLog from "./EmailsSentLog";
import Header from "./Header";
import SelectNations from "./SelectNations";
import SendingProgress from "./SendingProgress";
import SingleContact from "./SingleContact";

const EmailSender = () => {
    const [message, setMessage] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);
    const [sendingLog, setSendingLog] = useState<string[]>([]);

    const sendEmail = useStoreActions((actions) => actions.sendEmail);
    const controller = useRef(new AbortController());

    const logMessage = (message: string) => {
        setSendingLog((prev) => {
            const newValue = [...prev, message];
            storeSendingLog(newValue);
            return newValue;
        });
    };

    const useCL = useContactList();
    const emailOptions = useEmailOptions();
    const singleContactState = useSingleContact({
        Component: emailOptions.EmailComponent,
    });

    useEffect(() => {
        const storedLog = readSendingLog();
        setSendingLog(storedLog);
    }, []);

    const logMessage = (message: string) => {
        setSendingLog((prev) => {
            const newValue = [...prev, message];
            storeSendingLog(newValue);
            return newValue;
        });
    };

    const onClickSendEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!emailOptions.selectedSubject) {
            setMessage("Please select or enter a subject");
            return false;
        }

        setIsSending(true);
        useCL.updateMaxSelectedContactsNotSent();
        const toSendCount = useCL.maxCount - useCL.emailsSent;
        const toSend = SINGLE_CONTACT_MODE
            ? [singleContactState.contact]
            : useCL.selectedContactsNotSent.slice(0, toSendCount);
        for await (const contact of toSend) {
            try {
                const { aborted } = controller.current.signal;
                if (aborted) {
                    controller.current = new AbortController();
                    break;
                }
                const sentStatus = await prepareAndSendEmail(contact);
                if (!sentStatus) return;
                contact.sentDate = new Date().toISOString();
                logMessage(`Email sent to ${contact.name} - ${contact.email}`);
                useCL.setEmailsSent((count) => ++count);
                saveLocalContacts([...useCL.contacts, ...toSend]); // Save updated contacts for each email sent
                await waitRandomSeconds(emailOptions.delay);
            } catch (error) {
                console.warn("*Debug* -> EmailSender.tsx -> handleSendEmails -> error:", error);
                logMessage(`Failed to send email to ${contact.name} - ${contact.email}`);
            }
        }
        setMessage("");
        setIsSending(false);
    };

    const prepareAndSendEmail = async (contact: ContactI3C) => {
        setMessage("Sending email, please wait...");

        const emailText = renderEmail(emailOptions.EmailComponent, { name: contact.name });

        const email: Email = {
            to: contact.email,
            subject: emailOptions.selectedSubject,
            body: emailText,
        };

        await sendEmail({ email, sendmode: "now" }); // TODO Implement sendmode?
        return true; // TODO Implement error handling?
    };

    const onClickCancel = () => {
        setIsSending(false);
        setMessage("Sending cancelled");
        controller.current.abort();
    };

    const sendButtonDisabled =
        isSending ||
        controller.current.signal.aborted ||
        (SINGLE_CONTACT_MODE
            ? !validateEmail(singleContactState.email) || !singleContactState.name
            : !useCL.selectedContactsNotSent.length);

    return (
        <div className="container_email_sender">
            <Header />
            <br />

            <div className="container_options_and_preview">
                <div className="container_options">
                    <div className="column_options_left">
                        {SINGLE_CONTACT_MODE ? (
                            <SingleContact state={singleContactState} />
                        ) : (
                            <SelectNations useCL={useCL} isSending={isSending} />
                        )}
                    </div>
                    <br />

                    <div className="column_options_right">
                        <EmailOptions
                            useCL={useCL}
                            emailOptions={emailOptions}
                            isSending={isSending}
                            singleContactMode={SINGLE_CONTACT_MODE}
                        />
                    </div>
                    <br />
                </div>

                <ButtonSendEmail
                    disabled={sendButtonDisabled}
                    onClick={onClickSendEmail}
                    emailsSent={useCL.emailsSent}
                />

                {isSending && <button onClick={onClickCancel}>Cancel sending</button>}
                {message && <p>{message}</p>}

                <div className="container_email_preview">
                    <EmailPreview
                        Component={emailOptions.EmailComponent}
                        name={SINGLE_CONTACT_MODE ? singleContactState.name : useCL.nextContactNotSent.name}
                    />
                </div>
            </div>

            {__DEV__ ? (
                <button onClick={() => removeLocalStorageItem("contactsI3C")}>Empty local storage</button>
            ) : null}
            <br />
            {!SINGLE_CONTACT_MODE && <SendingProgress useCL={useCL} />}
            <br />
            {!SINGLE_CONTACT_MODE && <EmailsSentLog logMessages={sendingLog} />}
        </div>
    );
};

export default EmailSender;
