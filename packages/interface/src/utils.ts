import jsCharDet from "jschardet";
import * as XLSX from "xlsx";
import type { FileContent, SpreadsheetData } from "./types/types.ts";

// Parse an array containing raw bytes from a spreadsheet of some format. XLSX will auto-detect the format
function parseSpreadsheet(data: FileContent): SpreadsheetData {
    if (data.length === 0) {
        return [[]];
    }

    try {
        // Use xlsx.js to parse the spreadsheet data
        const parsed = XLSX.read(data.slice(), {
            type: "array",
            // According to the docs dateNF can be set to a string value to specify date format.
            // See https://docs.sheetjs.com/docs/api/parse-options#parsing-options and https://github.com/SheetJS/sheetjs/issues/718
            // Changing to date format string caused issues with parsing non-english charaters for some reason. Keeping it as is to not change runtime behaviour.
            // @ts-expect-error: see comment above.
            dateNF: true,
            cellDates: true,
        });
        const sheet = parsed.Sheets[parsed.SheetNames[0]];
        const sheetArray = XLSX.utils.sheet_to_json<string[]>(sheet, {
            header: 1,
        });

        return sheetArray;
    } catch (e) {
        console.warn("Error when parsing spreading; using fallback", e);
    }
    // CSV parsing may fail for different file encodings.
    // Use jsCharDet to attempt to detect the encoding and try to parse the data again.
    try {
        const dataArray = new Uint8Array(data);
        const rawString = String.fromCharCode.apply(null, Array.from(dataArray));
        const detected = jsCharDet.detect(rawString);
        const targetEncoding = (detected.confidence > 0.9 && detected.encoding) || "utf-8";
        console.log("Detected encoding", detected, "Trying encoding", targetEncoding);

        const parsedStr = new TextDecoder(targetEncoding).decode(dataArray);
        const parsed = XLSX.read(parsedStr, { type: "string" });
        const sheet = parsed.Sheets[parsed.SheetNames[0]];
        const sheetArray = XLSX.utils.sheet_to_json<string[]>(sheet, {
            header: 1,
        });

        return sheetArray;
    } catch (e) {
        console.warn("Error when parsing spreading as unicode", e);
    }

    // CSV parsing may fail when trying to process date cells, so we fall back to not processing the date cells.
    try {
        const parsed = XLSX.read(data, {
            type: "array",
        });
        const sheet = parsed.Sheets[parsed.SheetNames[0]];
        const sheetArray = XLSX.utils.sheet_to_json<string[]>(sheet, {
            header: 1,
        });

        return sheetArray;
    } catch (e) {
        console.warn("Error when parsing spreading; no fallback available", e);
    }

    return [
        ["!! Error parsing spreadsheet !!"],
        ["Try saving your spreadsheet in a different format (e.g. .xlsx or .ods)"],
    ];
}

/**
 * Returns a promise that delays for number of milliseconds
 */
function delay(duration: number, abortFunction = () => false) {
    // ms to poll before testing if we should abort
    const POLLING_DURATION = 100;

    return new Promise<void>((resolve) => {
        const startTime = Date.now();
        const intervalHandle = window.setInterval(function () {
            if (Date.now() - startTime >= duration || abortFunction()) {
                resolve();
                window.clearTimeout(intervalHandle);
            }
        }, POLLING_DURATION);
    });
}

/**
 * Returns an "HH:mm:ss" formatted string
 */
function formatTime(time: number) {
    function pad(x: number) {
        return ("" + x).padStart(2, "0");
    }

    const seconds = Math.floor(time / 1000) % 60;
    const minutes = Math.floor(time / (60 * 1000)) % 60;
    const hours = Math.floor(time / (60 * 60 * 1000));

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export { delay, formatTime, parseSpreadsheet };
