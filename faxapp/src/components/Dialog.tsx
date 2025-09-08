import styled from 'styled-components';
import { Button, ConfirmationModal, Modal, VStack } from 'ui-kit';
import { UserDialog } from '../types/modelTypes';
import { useStoreActions } from '../store/store';

type Props = Partial<UserDialog>;

// Extend Modal props to include maxWidth
interface ModalProps {
  width?: number;
  maxWidth?: number;
}

// Inject styles into ConfirmationModal
const StyledConfirmationModal = styled(ConfirmationModal)<ModalProps>`
  overflow-y: auto;
  overflow: hidden auto;
  //   width: 800px;
  width: ${({ width }) => width}px;
  max-width: ${({ maxWidth }) => maxWidth}px;

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

// Inject styles into Modal
const StyledModal = styled(Modal)<ModalProps>`
  overflow-y: auto;
  overflow: hidden auto;
  width: ${({ width }) => width}px;
  max-width: ${({ maxWidth }) => maxWidth}px;
`;

function Dialog({
  title = 'Confirmation',
  message,
  confirmActionText = 'Confirm',
  onClose = () => {},
  onConfirm = () => {},
  showConfirmationModal,
  confirmActionKind,
  showConfirm,
  showCancel,
  width,
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
      width={width}
      maxWidth={maxWidth}
      noCloseOnClickBackdrop
      confirmActionText={confirmActionText}
      onConfirm={onConfirm}
      confirmActionKind={confirmActionKind}
      showConfirm={showConfirm}
      showCancel={showCancel}
    >
      <VStack gap={12}>{message}</VStack>
    </StyledConfirmationModal>
  ) : (
    <StyledModal
      title={title}
      onClose={_onClose}
      width={width}
      maxWidth={maxWidth}
      footer={<Button onClick={_onClose}>{confirmActionText}</Button>}
    >
      {message}
    </StyledModal>
  );
}

export default Dialog;
