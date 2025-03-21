import { useRef, useState } from "react";
import { TEmailComponent } from "../types/types";
import { KeyOfEmailComponents } from "../types/typesI3C";
import { minDelay } from "../constants/constants";
import { emailComponents, subjects } from "../constants/emailTemplates";
import LetterEnglish from "../components/letters/LetterEnglish";
import { useStoreActions, useStoreState } from "./storeHooks";

function useEmailOptions() {
    const [delay, setDelay] = useState<number>(minDelay);
    const [language, _setLanguage] = useState<KeyOfEmailComponents>("English");
    const [subjectOption, setSubjectOption] = useState<string>(subjects[language][0]);
    const [customSubject, setCustomSubject] = useState<string>("");
    const selectedSubject =
        subjectOption === "Custom Subject" || subjectOption === "Tilpasset Emne" ? customSubject : subjectOption;

    const setNationOptions = useStoreActions((actions) => actions.contactList.setNationOptions);
    const nationOptionsFetched = useStoreState((state) => state.contactList.nationOptionsFetched);

    const EmailComponentRef = useRef<TEmailComponent>(LetterEnglish);

    const setLanguage = (value: KeyOfEmailComponents) => {
        _setLanguage(value);
        if (value === "Norwegian") {
            setNationOptions(["NO"]);
        } else {
            setNationOptions(nationOptionsFetched);
        }
        setSubjectOption(subjects[value][0]);
        EmailComponentRef.current = emailComponents[value];
    };

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
