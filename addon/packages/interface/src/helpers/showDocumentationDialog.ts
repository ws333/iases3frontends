import { ActionCreator } from "easy-peasy";
import { UserDialog } from "../types/modelTypes";
import TextDocumentation from "../components/dialogTexts/TextDocumentation";

type Args = {
    setUserDialog: ActionCreator<Partial<UserDialog>>;
};

export function showDocumentationDialog({ setUserDialog }: Args) {
    setUserDialog({
        title: "Documentation",
        message: TextDocumentation(),
        confirmActionText: "Close",
        showConfirmationModal: false,
    });
}
