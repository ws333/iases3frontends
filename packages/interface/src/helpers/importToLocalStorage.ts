import { BlobReader, Entry, TextWriter, ZipReader } from "@zip.js/zip.js";
import { ImportStats } from "../types/types";
import { STORAGE_KEY, sessionFinishedText, zeroWidtSpace } from "../constants/constants";
import {
    getLocalStorageActiveContacts,
    getLocalStorageDeletedContacts,
    getLocalStorageLastImportExportDate,
    saveLocalStorageActiveContacts,
    saveLocalStorageDeletedContacts,
    saveLocalStorageLastImportExportDate,
} from "./localStorage";
import { ContactState, ImportData, mergeContacts } from "./mergeContacts";

export async function importToLocalStorage(file: File): Promise<ImportStats> {
    const importData: ImportData = { contacts: { active: [], deleted: [] }, exportDate: 0, lastImportExportDate: 0 };

    // Create a zip reader
    const zipReader = new ZipReader(new BlobReader(file));

    // Get entries from the zip file
    const entries: Entry[] = await zipReader.getEntries();

    // Track results
    let logsProcessed = 0;

    // Process each entry in the zip
    for (const entry of entries) {
        const fileName = entry.filename;
        const content = await entry.getData?.(new TextWriter());

        if (!content) continue;

        if (fileName === `${STORAGE_KEY.EXPORT_DATE}.json`) {
            importData.exportDate = Number(content) || 0;
            continue;
        }

        if (fileName === `${STORAGE_KEY.LAST_IMPORT_EXPORT_DATE}.json`) {
            importData.lastImportExportDate = Number(content) || 0;
            continue;
        }

        if (fileName === `${STORAGE_KEY.CONTACTS}.json`) {
            importData.contacts.active = JSON.parse(content);
            continue;
        }

        if (fileName === `${STORAGE_KEY.CONTACTS_DELETED}.json`) {
            importData.contacts.deleted = JSON.parse(content);
            continue;
        }

        if (fileName === `${STORAGE_KEY.SENDING_LOG}.json`) {
            logsProcessed = (await mergeSendingLogs(content)) || 0;
            continue;
        }

        console.error("importToLocalStorage -> entry in zip file not handled:", fileName);
    }

    await zipReader.close();

    const currentContactState: ContactState = {
        active: getLocalStorageActiveContacts(),
        deleted: getLocalStorageDeletedContacts(),
        lastImportExportDate: getLocalStorageLastImportExportDate(),
    };

    const [newContactState, importContactsStats] = mergeContacts(currentContactState, importData);
    saveLocalStorageActiveContacts(newContactState.active);
    saveLocalStorageDeletedContacts(newContactState.deleted);
    saveLocalStorageLastImportExportDate(importData.exportDate);

    return { ...importContactsStats, logsProcessed };
}

async function mergeSendingLogs(importedData: string) {
    try {
        // Parse imported logs
        const importedLogs: string[] = JSON.parse(importedData);

        // Get existing logs
        const existingLogsString = localStorage.getItem(STORAGE_KEY.SENDING_LOG);
        const existingLogs: string[] = JSON.parse(existingLogsString ?? "[]");

        const allLogs = [...existingLogs, ...importedLogs];

        // Remove any duplicates
        const logsSet = new Set(allLogs);
        logsSet.delete(zeroWidtSpace);
        const uniqueLogs = [...logsSet];

        // Reinsert newlines by inserting a zero width space before each sessionFinishedText
        const mergedLogs = uniqueLogs.reduce<string[]>(
            (acc, cur) => (cur.includes(sessionFinishedText) ? [...acc, zeroWidtSpace, cur] : [...acc, cur]),
            []
        );

        localStorage.setItem(STORAGE_KEY.SENDING_LOG, JSON.stringify(mergedLogs));
        return importedLogs.length;
    } catch (error) {
        console.error("importToLocalStorage -> failed to merge sending logs:", error);
    }
}
