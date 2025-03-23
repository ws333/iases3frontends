import { ContactI3C } from "../types/typesI3C";
import { STORAGE_KEY, StorageKey } from "../constants/constants";

export function saveLocalStorageActiveContacts(contacts: ContactI3C[]) {
    localStorage.setItem(STORAGE_KEY.CONTACTS, JSON.stringify(contacts));
}

export function saveLocalStorageDeletedContacts(contacts: ContactI3C[]) {
    localStorage.setItem(STORAGE_KEY.CONTACTS_DELETED, JSON.stringify(contacts));
}

export function saveLocalStorageLastImportExportDate(timestamp: number) {
    localStorage.setItem(STORAGE_KEY.LAST_IMPORT_EXPORT_DATE, timestamp.toString());
}

export function getLocalStorageActiveContacts(): ContactI3C[] {
    const stored = localStorage.getItem(STORAGE_KEY.CONTACTS);
    return stored ? (JSON.parse(stored) as ContactI3C[]) : [];
}

export function getLocalStorageDeletedContacts(): ContactI3C[] {
    const stored = localStorage.getItem(STORAGE_KEY.CONTACTS_DELETED);
    return stored ? (JSON.parse(stored) as ContactI3C[]) : [];
}

export function getLocalStorageLastImportExportDate() {
    const stored = localStorage.getItem(STORAGE_KEY.LAST_IMPORT_EXPORT_DATE);
    return stored ? Number(stored) : 0;
}

export function removeLocalStorageItem(key: string): void {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
    } else {
        console.error("removeLocalStorageItem -> window object is undefined!");
    }
}

export function resetLocalStorage() {
    for (const key in STORAGE_KEY) {
        removeLocalStorageItem(STORAGE_KEY[key as StorageKey]);
    }
}
