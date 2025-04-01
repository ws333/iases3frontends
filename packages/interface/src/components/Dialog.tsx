import { ConfirmationModal, VStack } from "radzionkit";
import styled from "styled-components";
import { UserDialog } from "../types/modelTypes";
import { useStoreActions } from "../hooks/storeHooks";

type Props = Partial<UserDialog>;

// Inject styles into ConfirmationModal
const StyledConfirmationModal = styled(ConfirmationModal)`
    overflow-y: auto;
    overflow: hidden auto;

    /* Target the confirm button to allow text wrapping */
    button {
        white-space: normal;
        word-break: break-word;
        height: auto;
        min-height: 40px;
        padding: 8px 16px;
        text-align: center;
    }
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
            noCloseOnClickBackdrop
            confirmActionText={confirmActionText}
            onConfirm={onConfirm}
        >
            <VStack gap={12}>{message}</VStack>
        </StyledConfirmationModal>
    );
}

export default Dialog;
