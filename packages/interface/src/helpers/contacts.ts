import { ContactI3C } from "../types/typesI3C";
import { CONTACTS_CSV_URL, NATIONS_CSV_URL, NATIONS_FALLBACK, STORAGE_KEY } from "../constants/constants";
import { csvParse } from "./csvParse";

export async function fetchOnlineNations(signal: AbortSignal): Promise<string[]> {
    const response = await fetch(NATIONS_CSV_URL, { signal });
    const csvText = await response.text();
    const nations = /^[A-Z,]+$/.exec(csvText)?.toString().split(","); // Only allow uppercase letters and commas
    return nations ?? NATIONS_FALLBACK;
}

export async function fetchOnlineContacts(signal: AbortSignal): Promise<ContactI3C[]> {
    const response = await fetch(CONTACTS_CSV_URL, { signal });
    const csvText = await response.text();
    return csvParse<ContactI3C>(csvText).data;
}

export async function fetchAndMergeContacts(signal: AbortSignal): Promise<ContactI3C[]> {
    const onlineContacts = await fetchOnlineContacts(signal);
    const localContacts = getLocalActiveContacts();

    // Create a Set of online UIDs for O(1) lookups
    const onlineContactUids = new Set(onlineContacts.map((contact) => contact.uid));

    // Find local contacts that are not in onlineContacts - O(n) operation
    const deletedContacts = localContacts.filter((localContact) => !onlineContactUids.has(localContact.uid));

    // Set deletionDate
    const now = Date.now();
    deletedContacts.forEach((contact) => {
        contact.deletionDate = now;
    });
    console.table(deletedContacts);

    // Merge the deleted contacts with any stored deleted contacts
    const storedDeletedContacts = getLocalDeletedContacts();
    const mergedDeletedContacts = storedDeletedContacts.concat(deletedContacts);
    saveLocalDeletedContacts(mergedDeletedContacts);

    // Create a Map for local contacts using UID as key for O(1) lookups
    const localContactsMap = new Map(localContacts.map((contact) => [contact.uid, contact]));

    // Merge the online contacts with the local contacts - O(n) operation
    const merged = onlineContacts.map((oc): ContactI3C => {
        const local = localContactsMap.get(oc.uid);
        return local?.sentDate
            ? {
                  ...oc,
                  sentDate: local.sentDate,
                  sentCount: local.sentCount,
                  customFrontend01: local.customFrontend01,
                  customFrontend02: local.customFrontend02,
              }
            : oc;
    });

    return merged;
}

export function saveLocalActiveContacts(contacts: ContactI3C[]) {
    localStorage.setItem(STORAGE_KEY.CONTACTS, JSON.stringify(contacts));
}

export function saveLocalDeletedContacts(contacts: ContactI3C[]) {
    localStorage.setItem(STORAGE_KEY.CONTACTS_DELETED, JSON.stringify(contacts));
}

export function getLocalActiveContacts(): ContactI3C[] {
    const stored = localStorage.getItem(STORAGE_KEY.CONTACTS);
    return stored ? (JSON.parse(stored) as ContactI3C[]) : [];
}
export function getLocalDeletedContacts(): ContactI3C[] {
    const stored = localStorage.getItem(STORAGE_KEY.CONTACTS_DELETED);
    return stored ? (JSON.parse(stored) as ContactI3C[]) : [];
}
