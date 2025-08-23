import styled from "styled-components";
import { Modal } from "ui-kit";
import { Button, ConfirmationModal, VStack } from "ui-kit";
import { UserDialog } from "../types/modelTypes";
import { useStoreActions } from "../store/store";

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

// Extend Modal props to include maxWidth
interface ModalProps {
    maxWidth?: number;
}

// Inject styles into Modal
const StyledModal = styled(Modal)<ModalProps>`
    overflow-y: auto;
    overflow: hidden auto;
    width: 92%;
    max-width: ${({ maxWidth }) => maxWidth}px;
`;

const defaultMaxWidth = 800;

function Dialog({
    title = "Confirmation",
    message,
    confirmActionText = "Confirm",
    onClose = () => {},
    onConfirm = () => {},
    showConfirmationModal,
    maxWidth,
}: Props) {
    const closeDialog = useStoreActions((actions) => actions.userDialog.closeDialog);

    const _onClose = () => {
        onClose();
        closeDialog();
    };

    return showConfirmationModal ? (
        <StyledConfirmationModal
            title={title}
            onClose={_onClose}
            noCloseOnClickBackdrop
            confirmActionText={confirmActionText}
            onConfirm={onConfirm}
        >
            <VStack gap={12}>{message}</VStack>
        </StyledConfirmationModal>
    ) : (
        <StyledModal
            maxWidth={maxWidth ?? defaultMaxWidth}
            title={title}
            onClose={_onClose}
            footer={<Button onClick={_onClose}>{confirmActionText}</Button>}
        >
            {message}
        </StyledModal>
    );
}

export default Dialog;
