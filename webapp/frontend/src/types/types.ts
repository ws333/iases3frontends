import { templatesHTML } from '../constants/emailTemplates';

// Mofdified version of type ContactI3C from IASES3 extractor project
export type ContactI3C = {
  uid: number; // Artificial unixtimestamp in milliseconds
  na: string;
  i: string;
  n: string;
  e: string;
  sd: string;
  ud: string;
};

export type Contact = Pick<ContactI3C, 'n' | 'e'>;

export type KeyOfTemplatesHTML = keyof typeof templatesHTML;

export type Subjects = Record<KeyOfTemplatesHTML, string[]>;
