import { BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";
import { ContactI3C } from "../types/typesI3C";
import { STORAGE_KEY, StorageKey } from "../constants/constants";

export async function exportFromLocalStorage() {
    // Export date is used at import to avoid duplications
    localStorage.setItem(STORAGE_KEY.EXPORT_DATE, Date.now().toString());

    // Create a zip file
    const blobWriter = new BlobWriter("application/zip");
    const zipWriter = new ZipWriter(blobWriter);

    // Add each localStorage item to the zip
    for (const property in STORAGE_KEY) {
        const key = STORAGE_KEY[property as StorageKey];
        const data = localStorage.getItem(key);
        if (data) {
            // Parse data and extract fields to be exported
            const dataToExport =
                key === "contactsI3C_exportDate" ||
                key === "contactsI3C_lastImportExportDate" ||
                key === "contactsI3C_sendingLog"
                    ? data
                    : key === "contactsI3C"
                      ? JSON.stringify(
                            (JSON.parse(data) as ContactI3C[]).map(
                                (d): Partial<ContactI3C> => ({
                                    uid: d.uid,
                                    sentDate: d.sentDate,
                                    sentCount: d.sentCount,
                                    customFrontend01: d.customFrontend01,
                                    customFrontend02: d.customFrontend02,
                                })
                            )
                        )
                      : key === "contactsI3C_deleted"
                        ? JSON.stringify(
                              (JSON.parse(data) as ContactI3C[]).map(
                                  (d): Partial<ContactI3C> => ({
                                      uid: d.uid,
                                      sentDate: d.sentDate,
                                      sentCount: d.sentCount,
                                      deletionDate: d.deletionDate,
                                      customFrontend01: d.customFrontend01,
                                      customFrontend02: d.customFrontend02,
                                  })
                              )
                          )
                        : `exportFromLocalStorage -> missing check for key: ${key}`;

            await zipWriter.add(`${key}.json`, new TextReader(dataToExport));
        }
    }

    // Close the zip and get the final blob
    const blob = await zipWriter.close();

    // Create and trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "iases3_export.zip";
    a.click();
    URL.revokeObjectURL(url);
}
