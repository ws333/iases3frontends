import { ActionCreator } from "easy-peasy";
import { UserDialog } from "../types/modelTypes";
import { LOCAL_STORAGE_CONTACTS_KEY, LOCAL_STORAGE_SENDING_LOG_KEY } from "../constants/constants";
import TextDeletingData from "../components/dialogTexts/TextDeletingData";
import { removeLocalStorageItem } from "./localStorageHelpers";

type Args = {
    setUserDialog: ActionCreator<Partial<UserDialog>>;
};

export function cleanupLocalStorage({ setUserDialog }: Args) {
    setUserDialog({
        title: "Deletion warning!",
        message: TextDeletingData,
        confirmActionText: "Confirm deletion",
        onConfirm: () => {
            removeLocalStorageItem(LOCAL_STORAGE_CONTACTS_KEY);
            removeLocalStorageItem(LOCAL_STORAGE_SENDING_LOG_KEY);
            setUserDialog({ message: "" });
        },
    });
}
