import { LOCAL_STORAGE_SENDING_LOG_KEY } from "../constants/constants";

export function storeSendingLog(log: string[]) {
    localStorage.setItem(LOCAL_STORAGE_SENDING_LOG_KEY, JSON.stringify(log));
}

export function readSendingLog() {
    const log = localStorage.getItem(LOCAL_STORAGE_SENDING_LOG_KEY);
    return JSON.parse(log || "[]") as string[];
}
