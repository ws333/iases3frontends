import { emailComponents } from "../constants/emailTemplates";

// Modified version of type ContactI3C from IASES3 extractor project
export type ContactI3C = {
    uid: number; // Artificial unixtimestamp in milliseconds
    nation: string;
    institution: string;
    subGroup: string;
    name: string;
    email: string;
    updatedDate: string;
    sentDate: number;
    sentCount: number;
    deletionDate: number;
    customBackend01: string;
    customBackend02: string;
    customFrontend01: string;
    customFrontend02: string;
};

export type Contact = Pick<ContactI3C, "name" | "email">;

export type KeyOfEmailComponents = keyof typeof emailComponents;

export type Subjects = Record<KeyOfEmailComponents, string[]>;
