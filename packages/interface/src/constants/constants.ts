export const __DEV__ = import.meta.env.DEV;

export const STORAGE_KEY = {
    CONTACTS: "contactsI3C",
    CONTACTS_DELETED: "contactsI3C_deleted",
    SENDING_LOG: "sendingLog",
} as const;

export type StorageKey = keyof typeof STORAGE_KEY;

export const minDelay = 3; // Minimum delay between emails being sent in seconds
export const defaultRandomWindow = 1;
export const fullProgressBarDelay = 2;

export const NATIONS_CSV_URL = "https://iase.one/contact_lists/nations.csv";
export const NATIONS_FALLBACK = ["EU", "FR", "GB", "NO"];

export const sessionFinishedText = "Session finished!";

// Used to send to just one specified contact per session, i.e. disable the use of the contacts list.
// export const SINGLE_CONTACT_MODE = true;
export const SINGLE_CONTACT_MODE = import.meta.env.VITE_SINGLE_CONTACT_MODE === "1";
