import LetterEnglish from "../components/letters/LetterEnglish";
import LetterItalian from "../components/letters/LetterItalian";
import LetterNorwegian from "../components/letters/LetterNorwegian";
import { objectEntries } from "../helpers/objectHelpers";

export const customSubjectTitles: CustomSubjectTitles = {
    English: "Custom Subject",
    Italian: "Oggetto Personalizzato",
    Norwegian: "Tilpasset Emne",
};

export const customSubjectTitlesArray = objectEntries(customSubjectTitles).map((item) => item[1]);

export const subjects: Subjects = {
    English: [
        "The Interstellar Alliance Social Experiment Group",
        "Public Disclosure of UFO/UAP Information",
        "Call for Transparency on UFO/UAP and Extraterrestrial presence",
        "End UFO secrets now, begin public education",
        "Petition for UFO/UAP Disclosure within One year",
        customSubjectTitles.English,
    ],
    Italian: [
        "The Interstellar Alliance Social Experiment Group",
        "Divulgazione Pubblica di Informazioni su UFO/UAP",
        "Appello per la Trasparenza su UFO/UAP e Presenza Extraterrestre",
        "Porre Fine ai Segreti sugli UFO Ora, Avviare l'Istruzione Pubblica",
        "Petizione per la Divulgazione di UFO/UAP entro un Anno",
        customSubjectTitles.Italian,
    ],
    Norwegian: [
        "Åpenhet og offentliggjøring av UAP informasjon",
        "Støtt frigjøringen av UAP-informasjon",
        "Offentliggjøring av informasjon angående UAP",
        "Forespørsel om offentliggjøring av UAP-informasjon",
        customSubjectTitles.Norwegian,
    ],
};

export const emailComponents = {
    English: LetterEnglish,
    Italian: LetterItalian,
    Norwegian: LetterNorwegian,
};

export type LanguageOption = keyof typeof emailComponents;
export type Subjects = Record<LanguageOption, string[]>;
export type CustomSubjectTitles = Record<LanguageOption, string>;
export type SubjectPerLanguage = { [K in LanguageOption]?: string };

export const defaultLanguage: LanguageOption = "English";
export const defaultLanguageOptions: LanguageOption[] = ["English"];
