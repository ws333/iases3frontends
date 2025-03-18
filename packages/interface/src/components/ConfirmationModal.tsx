import { ConfirmationModal, VStack } from "radzion-ui";
import { UserDialog } from "../types/types";

type Props = UserDialog;

function ConfirmationDialog({
    title = "Confirmation",
    message,
    confirmActionText = "Confirm",
    onClose = () => {},
    onConfirm = () => {},
}: Props) {
    return (
        <ConfirmationModal title={title} onClose={onClose} confirmActionText={confirmActionText} onConfirm={onConfirm}>
            <VStack gap={12}>{message}</VStack>
        </ConfirmationModal>
    );
}

export default ConfirmationDialog;
