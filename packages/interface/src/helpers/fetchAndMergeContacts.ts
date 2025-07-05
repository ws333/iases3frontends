import { ContactI3C } from "../types/typesI3C";
import {
    CONTACTS_CSV_URL,
    ERROR_EMPTY_CONTACTS_ARRAY,
    ERROR_EMPTY_COUNTRY_CODES_ARRAY,
    ERROR_FETCHING_CONTACTS,
    NATIONS_CSV_URL,
} from "../constants/constants";
import {
    checkIfActiveAndOnlineContactsSynced,
    checkOverlapIndexedDBActiveAndDeletedContacts,
} from "./checkOverlapInData";
import { csvParse } from "./csvParse";
import { fetchWithTimeout } from "./fetchWithTimeout";
import {
    getActiveContacts,
    getCountryCodesFetched,
    initializeStorage,
    removeActiveContactByUid,
    storeActiveContacts,
    storeDeletedContacts,
} from "./indexedDB";

export async function fetchOnlineNations(): Promise<string[]> {
    try {
        const response = await fetchWithTimeout({ url: NATIONS_CSV_URL, errorMessage: ERROR_FETCHING_CONTACTS }); // Display the same error as for contacts in the ErrorBoundary
        const csvText = await response.text();
        const nations = /^[A-Z,]+$/.exec(csvText)?.toString().split(","); // Only allow uppercase letters and commas
        const countrycodes = nations ?? (await getCountryCodesFetched());
        if (!countrycodes.length) throw new Error(ERROR_EMPTY_COUNTRY_CODES_ARRAY);
        return countrycodes;
    } catch (error) {
        console.warn("fetchOnlineNations:", error);
        throw error;
    }
}

async function fetchOnlineContacts(): Promise<ContactI3C[]> {
    try {
        const response = await fetchWithTimeout({ url: CONTACTS_CSV_URL, errorMessage: ERROR_FETCHING_CONTACTS });
        const csvText = await response.text();
        return csvParse<ContactI3C>(csvText).data;
    } catch (error) {
        console.warn("fetchOnlineContacts:", error);
        throw error;
    }
}

export async function fetchAndMergeContacts(fetchFn = fetchOnlineContacts): Promise<ContactI3C[]> {
    const onlineContacts = await fetchFn();
    if (!onlineContacts.length) throw new Error(ERROR_EMPTY_CONTACTS_ARRAY);

    await initializeStorage(onlineContacts); // Initialize indexedDB storage
    const localContacts = await getActiveContacts();
    const contactsCountDiff = onlineContacts.length - localContacts.length;

    // Create a Set of online UIDs for O(1) lookups
    const onlineContactUids = new Set(onlineContacts.map((contact) => contact.uid));

    // Find and remove all active local contacts not in onlineContacts from indexedDB store activeContacts - O(n) operation
    // If the contact has a sent count then first store it in indexedDB store deletedContacts to retain sending history
    const now = Date.now();
    const deletedContacts = localContacts.filter((localContact) => !onlineContactUids.has(localContact.uid));
    for await (const contact of deletedContacts) {
        if (contact.sc > 0) {
            contact.dd = now;
            await storeDeletedContacts(contact);
        }
        await removeActiveContactByUid(contact.uid);
    }

    // Verify that there is no overlap between active and deleted contacts in indexedDB
    await checkOverlapIndexedDBActiveAndDeletedContacts();

    // Verify that active local contacts are synced with online contacts
    await checkIfActiveAndOnlineContactsSynced(onlineContactUids);

    // Create a Map for local contacts using UID as key for O(1) lookups
    // Then merge the online contacts with the local contacts - O(n) operation
    const localContactsMap = new Map(localContacts.map((contact) => [contact.uid, contact]));
    let updatedContactsCount = 0;
    const mergedContacts = onlineContacts.map((oc): ContactI3C => {
        const local = localContactsMap.get(oc.uid);
        if (local && new Date(oc.ud) > new Date(local.ud)) updatedContactsCount++;
        return local?.sd
            ? {
                  ...oc,
                  sd: local.sd,
                  sc: local.sc,
                  cf1: local.cf1,
                  cf2: local.cf2,
              }
            : oc;
    });

    // Log any changes made
    if (deletedContacts.length) {
        console.log(`Deleted ${deletedContacts.length} contacts:`);
        console.table(deletedContacts);
    }
    if (updatedContactsCount) console.log(`Updated ${updatedContactsCount} contacts!`);
    if (contactsCountDiff > 0) console.log(`Added ${contactsCountDiff} new contacts!`);

    await storeActiveContacts(mergedContacts);

    return mergedContacts;
}
