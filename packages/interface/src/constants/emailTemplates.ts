import LetterEnglish from "../components/letters/LetterEnglish";
import LetterNorwegian from "../components/letters/LetterNorwegian";
import { Subjects } from "../types/typesI3C";

export const subjects: Subjects = {
    English: [
        "The Interstellar Alliance Social Experiment Group",
        "Public Disclosure of UFO/UAP Information",
        "Call for Transparency on UFOs and Extraterrestrial Evidence",
        "End UFO secrets Now, begin public education",
        "Petition for Immediate UFO/UAP Disclosure within One year",
        "A plea for Openness: UFOs Pose No Threat",
        "Time for Truth: Release All UFO/UAP Data",
        "Interstellar Alliance: UFO Secrets Must End Now",
        "Custom Subject",
    ],
    Norwegian: [
        "Åpenhet og offentliggjøring av UAP informasjon",
        "Støtt frigjøringen av UAP-informasjon",
        "Offentliggjøring av informasjon angående UAP",
        "Krav om offentliggjøring av UAP-informasjon",
        "Tilpasset Emne",
    ],
};

export const emailComponents = {
    English: LetterEnglish,
    Norwegian: LetterNorwegian,
};
