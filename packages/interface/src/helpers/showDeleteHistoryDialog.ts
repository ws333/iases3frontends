import { ActionCreator } from "easy-peasy";
import { UserDialog } from "../types/modelTypes";
import { STORAGE_KEY } from "../constants/constants";
import TextDeletingData from "../components/dialogTexts/TextDeletingData";
import { removeLocalStorageItem } from "./localStorageHelpers";

type Args = {
    initiateForcedRender: ActionCreator<void>;
    setUserDialog: ActionCreator<Partial<UserDialog>>;
};

export function showDeleteHistoryDialog({ initiateForcedRender, setUserDialog }: Args) {
    setUserDialog({
        title: "Deletion warning!",
        message: TextDeletingData,
        confirmActionText: "Confirm deletion",
        onConfirm: () => {
            removeLocalStorageItem(STORAGE_KEY.CONTACTS);
            removeLocalStorageItem(STORAGE_KEY.SENDING_LOG);
            setUserDialog({ message: "Sending history deleted!" });
            initiateForcedRender();
            console.log("Sending data has been deleted!");
        },
    });
}
