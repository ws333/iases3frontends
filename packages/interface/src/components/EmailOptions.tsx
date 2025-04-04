import { Tooltip } from "radzionkit/ui/tooltips/Tooltip";
import { FocusEvent, useEffect, useRef, useState } from "react";
import { minSendingDelay } from "../constants/constants";
import { KeyOfEmailComponents, emailComponents, subjects } from "../constants/emailTemplates";
import { UseContactListReturnType } from "../hooks/useContactList";
import { useEmailOptions } from "../hooks/useEmailOptions";
import { storeOptionsKey } from "../helpers/indexedDB";
import { objectKeys } from "../helpers/objectHelpers";
import "./EmailOptions.css";

export type EmailOptionsProps = {
    useCL: UseContactListReturnType;
    emailOptions: ReturnType<typeof useEmailOptions>;
    isSending: boolean;
    singleContactMode: boolean;
};

function EmailOptions({ useCL, emailOptions, isSending, singleContactMode }: EmailOptionsProps) {
    const customSubjectRef = useRef<HTMLInputElement>(null);
    if (customSubjectRef.current) {
        customSubjectRef.current.value = emailOptions.customSubject;
    }

    const onBlurCustomSubject = (e: FocusEvent<HTMLInputElement>) => {
        if (customSubjectRef.current) {
            customSubjectRef.current.value = e.target.value;
        }
        emailOptions.setCustomSubject(e.target.value);
    };

    const customSubjectVisible =
        emailOptions.subjectOption === "Custom Subject" || emailOptions.subjectOption === "Tilpasset Emne"; // TODO:Use last items in the subjects array for these strings

    useEffect(() => {
        if (customSubjectVisible) {
            const input = document.getElementById("custom_subject_input");
            input?.focus();
        }
    }, [customSubjectVisible]);

    // Update local delay after hydration
    useEffect(() => {
        setLocalDelay(emailOptions.delay.toString());
    }, [emailOptions.delay]);

    // Using local state to allow empty input
    const [localDelay, setLocalDelay] = useState(emailOptions.delay.toString());

    function processDelayInput(value: string) {
        const delay = Number(value);
        return delay > minSendingDelay ? delay : minSendingDelay;
    }

    return (
        <div className="email-options">
            {!singleContactMode && (
                <div className="delay-input">
                    <Tooltip
                        placement="top"
                        renderOpener={(props) => (
                            <label {...props}>
                                Delay in seconds between emails sent
                                <br />
                                <div className="container-delay">
                                    <div>
                                        <input
                                            id="delay_input"
                                            type="number"
                                            value={localDelay}
                                            disabled={isSending}
                                            min={minSendingDelay.toString()}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setLocalDelay(value.toString());
                                                storeOptionsKey(processDelayInput(value), "delay");
                                            }}
                                            onBlur={(e) => {
                                                const delay = processDelayInput(e.target.value);
                                                setLocalDelay(delay.toString());
                                                emailOptions.setDelay(delay);
                                            }}
                                        />
                                    </div>
                                </div>
                            </label>
                        )}
                        content={
                            <span className="tooltip-min-sending-delay">
                                {minSendingDelay} is the minimum to avoid rate limits, increase if hitting the rate
                                limit for your email provider.
                            </span>
                        }
                    />
                </div>
            )}

            {!singleContactMode && (
                <div className="number-of-emails">
                    <label>
                        Number of emails to send in this session
                        <br />
                        <select
                            value={useCL.maxCount}
                            disabled={isSending}
                            onChange={(e) => useCL.setMaxCount(Number(e.target.value))}
                        >
                            {useCL.maxCountOptions.map((count) => (
                                <option key={count} value={count}>
                                    {count}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            )}

            <label>
                Email language
                <br />
                <select
                    value={emailOptions.language}
                    disabled={isSending}
                    onChange={(e) => emailOptions.setLanguage(e.target.value as KeyOfEmailComponents)}
                >
                    {objectKeys(emailComponents).map((_language) => (
                        <option key={_language} value={_language}>
                            {_language}
                        </option>
                    ))}
                </select>
            </label>

            <div className="subject-input">
                <label>
                    Subject
                    <br />
                    <select
                        value={emailOptions.subjectOption}
                        disabled={isSending}
                        onChange={(e) => emailOptions.setSubjectOption(e.target.value)}
                    >
                        {subjects[emailOptions.language].map((_subject) => (
                            <option key={_subject} value={_subject}>
                                {_subject}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label
                className="custom-subject"
                style={{
                    display: customSubjectVisible ? "inline-block" : "none",
                }}
            >
                Custom Subject <br />
                <input
                    id="custom_subject_input"
                    type="text"
                    disabled={isSending}
                    ref={customSubjectRef}
                    onChange={() => null}
                    onBlur={onBlurCustomSubject}
                    required
                />
            </label>
        </div>
    );
}

export default EmailOptions;
