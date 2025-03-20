import { ConfirmationModal, VStack } from "radzionkit";
import styled from "styled-components";
import { UserDialog } from "../types/modelTypes";
import { useStoreActions } from "../hooks/storeHooks";

type Props = Partial<UserDialog>;

// Inject styles into ConfirmationModal
const StyledConfirmationModal = styled(ConfirmationModal)`
    overflow-y: auto;
    overflow: hidden auto;
`;

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
        <StyledConfirmationModal
            title={title}
            onClose={_onClose}
            confirmActionText={confirmActionText}
            onConfirm={onConfirm}
        >
            <VStack gap={12}>{message}</VStack>
        </StyledConfirmationModal>
    );
}

export default Dialog;
