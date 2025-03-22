import { STORAGE_KEY } from "../constants/constants";

export function storeSendingLog(log: string[]) {
    localStorage.setItem(STORAGE_KEY.SENDING_LOG, JSON.stringify(log));
}

export function readSendingLog() {
    const log = localStorage.getItem(STORAGE_KEY.SENDING_LOG);
    return JSON.parse(log || "[]") as string[];
}
