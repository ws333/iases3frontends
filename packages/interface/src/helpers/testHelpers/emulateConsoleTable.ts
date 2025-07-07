import { ContactI3C } from "../../types/typesI3C";

/**
 * Emulate console.table in the Test Results window
 */
export function emulateConsoleTable(data: ContactI3C[]) {
    const columns = [
        { key: "uid", width: 4 },
        { key: "na", width: 4 },
        { key: "i", width: 6 },
        { key: "s", width: 7 },
        { key: "n", width: 7 },
        { key: "e", width: 17 },
        { key: "sd", width: 14 },
        { key: "sc", width: 4 },
        { key: "ud", width: 12 },
        { key: "dd", width: 14 },
        { key: "cb1", width: 5 },
        { key: "cb2", width: 5 },
        { key: "cf1", width: 5 },
        { key: "cf2", width: 5 },
    ];

    const pad = (str: string | number | undefined, width: number) => {
        str = str === undefined || str === null ? "" : String(str);
        return str.length > width ? str.slice(0, width) : str.padEnd(width, " ");
    };

    const hLine = "⎯";
    const vline = "";

    const header = columns.map((col) => pad(col.key, col.width)).join(vline);
    const separator = columns.map((col) => hLine.repeat(col.width)).join(vline);

    const rows = Array.from(data).map((row) =>
        columns.map((col) => pad(row[col.key as keyof ContactI3C], col.width)).join(vline)
    );

    console.log([header, separator, ...rows].join("\n") + "\n");
}
