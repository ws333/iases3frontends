import { getActiveContacts, getDeletedContacts } from "./indexedDB";

export async function checkOverlapIndexedDBActiveAndDeletedContacts() {
    const activeContacts = await getActiveContacts();
    const deletedContactsFromIndexedDB = await getDeletedContacts();
    const activeContactUids = new Set(activeContacts.map((contact) => contact.uid));
    const deletedContactUids = new Set(deletedContactsFromIndexedDB.map((contact) => contact.uid));
    const intersectionActiveDeleted = new Set([...activeContactUids].filter((uid) => deletedContactUids.has(uid)));
    const isOverlap = intersectionActiveDeleted.size > 0;
    if (isOverlap) {
        console.error("Overlap between active and deleted contacts in indexedDB!");
        console.table(intersectionActiveDeleted);
    }
    return isOverlap;
}

/**
 * Check for local contacts not found in online contacts (should not happen if deletions were successful)
 * This would not affect the user though as mergedContacts only contains the uids from onlineContacts
 */
export async function checkIfActiveAndOnlineContactsSynced(onlineContactUids: Set<number>) {
    const localContacts = await getActiveContacts();
    const localContactsNotOnline = localContacts.filter((lc) => !onlineContactUids.has(lc.uid));
    if (localContactsNotOnline.length) {
        console.warn(`Active local contacts not found online (${localContactsNotOnline.length}):`);
        console.table(localContactsNotOnline);
    }
    return localContactsNotOnline.length;
}
