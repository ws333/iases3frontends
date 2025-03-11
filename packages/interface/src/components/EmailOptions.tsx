import { FocusEvent, useRef, useState } from "react";
import { emailComponents, subjects } from "../constants/emailTemplates";
import { objectKeys } from "../helpers/objectHelpers";
import { UseContactListReturnType } from "../hooks/useContactList";
import { useEmailOptions } from "../hooks/useEmailOptions";
import { KeyOfEmailComponents } from "../types/typesI3C";
import "./EmailOptions.css";

export type EmailOptionsProps = {
    useCL: UseContactListReturnType;
    emailOptions: ReturnType<typeof useEmailOptions>;
    singleContactMode: boolean;
};

function EmailOptions({ useCL, emailOptions, singleContactMode }: EmailOptionsProps) {
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

    const [localDelay, setLocalDelay] = useState(emailOptions.delay.toString());
    return (
        <div className="email-options">
            {!singleContactMode && (
                <div className="delay-input">
                    <label>
                        Delay between emails sent{" "}
                        <input
                            type="number"
                            value={localDelay}
                            min="1"
                            onChange={(e) => setLocalDelay(e.target.value)}
                            onBlur={(e) => {
                                let value = Number(e.target.value);
                                if (value < 1) value = 1;
                                setLocalDelay(value.toString());
                                emailOptions.setDelay(value);
                            }}
                        />
                    </label>
                </div>
            )}

            {!singleContactMode && (
                <div className="number-of-emails">
                    <label>
                        Number of emails{" "}
                        <select value={useCL.maxCount} onChange={(e) => useCL.setMaxCount(Number(e.target.value))}>
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
                Email language <br />
                <select
                    value={emailOptions.language}
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
                    Subject{" "}
                    <select
                        value={emailOptions.subjectOption}
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
                <input type="text" ref={customSubjectRef} onChange={() => null} onBlur={onBlurCustomSubject} required />
            </label>
        </div>
    );
}

export default EmailOptions;
