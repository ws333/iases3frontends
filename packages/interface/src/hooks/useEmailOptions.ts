import { useCallback, useEffect, useRef, useState } from "react";
import { TEmailComponent } from "../types/types";
import { defaultMaxCount, defaultSendingDelay } from "../constants/constants";
import { KeyOfEmailComponents, defaultLanguage, emailComponents, subjects } from "../constants/emailTemplates";
import LetterEnglish from "../components/letters/LetterEnglish";
import { OPTIONS_KEY, getOptions, storeOptionsKey } from "../helpers/indexedDB";
import { useStoreActions, useStoreState } from "./storeHooks";

function useEmailOptions() {
    const [delay, _setDelay] = useState<number>(defaultSendingDelay);
    const [language, _setLanguage] = useState<KeyOfEmailComponents>(defaultLanguage);
    const [subjectOption, _setSubjectOption] = useState<string>(subjects[language][0]);
    const [customSubject, _setCustomSubject] = useState<string>("");
    const selectedSubject =
        subjectOption === "Custom Subject" || subjectOption === "Tilpasset Emne" ? customSubject : subjectOption;

    const setMaxCount = useStoreActions((actions) => actions.contactList.setMaxCount);
    const setNationOptions = useStoreActions((actions) => actions.contactList.setNationOptions);
    const nationOptionsFetched = useStoreState((state) => state.contactList.nationOptionsFetched);

    const EmailComponentRef = useRef<TEmailComponent>(LetterEnglish);

    const setDelay = (value: number) => {
        storeOptionsKey(value, "delay");
        _setDelay(value);
    };

    const setLanguage = useCallback(
        (value: KeyOfEmailComponents, subject?: string) => {
            storeOptionsKey(value, "language");
            _setLanguage(value);
            if (value === "Norwegian") {
                setNationOptions(["NO"]);
            } else {
                setNationOptions(nationOptionsFetched);
            }
            const _subject = subject ?? subjects[value][0];
            storeOptionsKey(_subject, "subject");
            _setSubjectOption(_subject);

            EmailComponentRef.current = emailComponents[value];
        },
        [nationOptionsFetched, setNationOptions]
    );

    const setSubjectOption = (value: string) => {
        storeOptionsKey(value, "subject");
        _setSubjectOption(value);
    };

    const setCustomSubject = (value: string) => {
        storeOptionsKey(value, "customSubject");
        _setCustomSubject(value);
    };

    useEffect(() => {
        const hydrateOptions = async () => {
            const options = await getOptions();
            if (options) {
                const delay = (options.find((item) => item.key === OPTIONS_KEY.DELAY)?.value ??
                    defaultSendingDelay) as number;
                _setDelay(delay);

                const _maxCount = (options.find((item) => item.key === OPTIONS_KEY.MAX_COUNT)?.value ??
                    defaultMaxCount) as number;
                setMaxCount(_maxCount);

                const customSubject = (options.find((item) => item.key === OPTIONS_KEY.CUSTOM_SUBJECT)?.value ??
                    "") as string;
                _setCustomSubject(customSubject);

                const language = (options.find((item) => item.key === OPTIONS_KEY.LANGUAGE)?.value ??
                    defaultLanguage) as KeyOfEmailComponents;
                const subject = (options.find((item) => item.key === OPTIONS_KEY.SUBJECT)?.value ??
                    subjects[language][0]) as string;
                setLanguage(language, subject);
            }
        };
        void hydrateOptions();
    }, [setLanguage, setMaxCount]);

    return {
        delay,
        setDelay,
        language,
        setLanguage,
        subjectOption,
        setSubjectOption,
        customSubject,
        setCustomSubject,
        selectedSubject,
        EmailComponent: EmailComponentRef.current,
    };
}
export { useEmailOptions };
