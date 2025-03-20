import { BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";
import { LOCAL_STORAGE_CONTACTS_KEY, LOCAL_STORAGE_SENDING_LOG_KEY } from "../constants/constants";

export async function exportLocalStorage() {
    const keys = [LOCAL_STORAGE_CONTACTS_KEY, LOCAL_STORAGE_SENDING_LOG_KEY];

    // Create a zip file
    const blobWriter = new BlobWriter("application/zip");
    const zipWriter = new ZipWriter(blobWriter);

    // Add each localStorage item to the zip
    for (const key of keys) {
        const data = localStorage.getItem(key);
        if (data) {
            await zipWriter.add(`${key}.json`, new TextReader(data));
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
