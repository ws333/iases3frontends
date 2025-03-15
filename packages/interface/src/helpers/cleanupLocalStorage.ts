import { LOCAL_STORAGE_CONTACTS_KEY, LOCAL_STORAGE_SENDING_LOG_KEY } from "../constants/constants";
import { removeLocalStorageItem } from "./localStorageHelpers";

export function cleanupLocalStorage() {
    removeLocalStorageItem(LOCAL_STORAGE_CONTACTS_KEY);
    removeLocalStorageItem(LOCAL_STORAGE_SENDING_LOG_KEY);
}
