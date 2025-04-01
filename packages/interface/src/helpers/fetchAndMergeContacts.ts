import { ContactI3C } from "../types/typesI3C";
import { CONTACTS_CSV_URL, DEFAULT_FETCH_TIMEOUT, NATIONS_CSV_URL, NATIONS_FALLBACK } from "../constants/constants";
import { checkNoOverlapActiveDeletedContacts } from "./checkNoOverlapActiveDeleted";
import { csvParse } from "./csvParse";
import {
    getActiveContacts,
    initializeStorage,
    removeActiveContactByUid,
    storeActiveContacts,
    storeDeletedContacts,
} from "./indexedDB";

function createTimeoutPromise(ms: number, controller: AbortController): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            controller.abort();
            reject(new Error(`Request timed out after ${ms}ms`));
        }, ms);
    });
}

export async function fetchOnlineNations(
    controller: AbortController,
    timeout = DEFAULT_FETCH_TIMEOUT
): Promise<string[]> {
    try {
        const response = await Promise.race([
            fetch(NATIONS_CSV_URL, { signal: controller.signal }),
            createTimeoutPromise(timeout, controller),
        ]);
        const csvText = await response.text();
        const nations = /^[A-Z,]+$/.exec(csvText)?.toString().split(","); // Only allow uppercase letters and commas
        return nations ?? NATIONS_FALLBACK;
    } catch (error) {
        console.warn("fetchAndMergeContacts.ts -> fetchOnlineNations error:", error);
        return NATIONS_FALLBACK;
    }
}

async function fetchOnlineContacts(
    controller: AbortController,
    timeout = DEFAULT_FETCH_TIMEOUT
): Promise<ContactI3C[]> {
    try {
        const response = await Promise.race([
            fetch(CONTACTS_CSV_URL, { signal: controller.signal }),
            createTimeoutPromise(timeout, controller),
        ]);

        const csvText = await response.text();
        return csvParse<ContactI3C>(csvText).data;
    } catch (error) {
        console.warn("fetchAndMergeContacts.ts -> fetchOnlineContacts error:", error);
        return [];
    }
}

export async function fetchAndMergeContacts(
    controller: AbortController,
    fetchFn = fetchOnlineContacts,
    timeout = DEFAULT_FETCH_TIMEOUT
): Promise<ContactI3C[]> {
    const onlineContacts = await fetchFn(controller, timeout);

    // Dont perform any operations if the fetch was aborted or the onlineContacts array is empty
    if (controller.signal.aborted || !onlineContacts.length) return [];

    await initializeStorage(onlineContacts); // Initialize indexedDB storage
    const localContacts = await getActiveContacts();

    // Create a Set of online UIDs for O(1) lookups
    const onlineContactUids = new Set(onlineContacts.map((contact) => contact.uid));

    // Find local contacts that are not in onlineContacts - O(n) operation
    const deletedContacts = localContacts.filter(
        (localContact) => !onlineContactUids.has(localContact.uid) && localContact.sc > 0
    );

    // Set deletionDate
    const now = Date.now();
    deletedContacts.forEach((contact) => {
        contact.dd = now;
    });
    if (deletedContacts.length) {
        console.log("Deleted contacts:");
        console.table(deletedContacts);
    }

    // Update indexedDB store deletedContacts
    await storeDeletedContacts(deletedContacts);

    // Remove deleted contacts from indexedDB store activeContacts
    for await (const contact of deletedContacts) {
        await removeActiveContactByUid(contact.uid);
    }

    // Check for no overlap between active and deleted contacts in indexedDB
    const isOverlap = await checkNoOverlapActiveDeletedContacts();
    if (isOverlap) console.error("Overlap between active and deleted contacts in indexedDB!");

    // Create a Map for local contacts using UID as key for O(1) lookups
    const localContactsMap = new Map(localContacts.map((contact) => [contact.uid, contact]));

    // Merge the online contacts with the local contacts - O(n) operation
    const mergedContacts = onlineContacts.map((oc): ContactI3C => {
        const local = localContactsMap.get(oc.uid);
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

    await storeActiveContacts(mergedContacts);

    return mergedContacts;
}
