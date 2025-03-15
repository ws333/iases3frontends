import { emailComponents } from "../constants/emailTemplates";

// Modified version of type ContactI3C from IASES3 extractor project
export type ContactI3C = {
    uid: number; // Artificial unixtimestamp in milliseconds
    nation: string;
    institution: string;
    subGroup: string;
    name: string;
    email: string;
    sentDate: number;
    sentCount: number;
    updatedDate: string;
    custom01: string;
    custom02: string;
    custom03: string;
};

export type Contact = Pick<ContactI3C, "name" | "email">;

export type KeyOfEmailComponents = keyof typeof emailComponents;

export type Subjects = Record<KeyOfEmailComponents, string[]>;
