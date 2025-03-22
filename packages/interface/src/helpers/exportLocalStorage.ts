import { BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";
import { ContactI3C } from "../types/typesI3C";
import { STORAGE_KEY } from "../constants/constants";

export async function exportLocalStorage() {
    const keys = [STORAGE_KEY.CONTACTS, STORAGE_KEY.CONTACTS_DELETED, STORAGE_KEY.SENDING_LOG];

    // Create a zip file
    const blobWriter = new BlobWriter("application/zip");
    const zipWriter = new ZipWriter(blobWriter);

    // Add each localStorage item to the zip
    for (const key of keys) {
        const data = localStorage.getItem(key);
        if (data) {
            // Parse data and extract fields to be exported
            const dataToExport =
                key === "sendingLog"
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
                        : "Error";

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
