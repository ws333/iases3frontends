import { ConfirmationModal, VStack } from "radzionkit";
import { UserDialog } from "../types/modelTypes";
import { useStoreActions } from "../hooks/storeHooks";

type Props = Partial<UserDialog>;

const styles = {
    width: 400,
};

function Dialog({
    title = "Confirmation",
    message,
    confirmActionText = "Confirm",
    onClose = () => {},
    onConfirm = () => {},
}: Props) {
    const closeDialog = useStoreActions((actions) => actions.userDialog.closeDialog);

    const _onClose = () => {
        onClose();
        closeDialog();
    };

    return (
        <ConfirmationModal
            style={styles}
            title={title}
            onClose={_onClose}
            confirmActionText={confirmActionText}
            onConfirm={onConfirm}
        >
            <VStack gap={12}>{message}</VStack>
        </ConfirmationModal>
    );
}

export default Dialog;
