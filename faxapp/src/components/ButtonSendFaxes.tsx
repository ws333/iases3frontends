import { MouseEventHandler } from 'react';
import { Button } from 'ui-kit';
import { useStoreState } from '../store/store';

type Props = {
  checkInProgress: boolean;
  disabled: boolean | string;
  endSession: boolean;
  leftToSendCount: number;
  onClick: MouseEventHandler;
};

function ButtonSendFaxes({ checkInProgress, disabled, endSession, leftToSendCount, onClick }: Props) {
  const faxesSent = useStoreState((state) => state.contactList.faxesSent);
  const selectedNations = useStoreState((state) => state.contactList.selectedNations);

  const buttonText =
    checkInProgress || endSession
      ? 'Please wait...'
      : !selectedNations.length
        ? 'No contacts selected'
        : !leftToSendCount
          ? 'Selected contacts processed'
          : !faxesSent
            ? 'Send faxes'
            : 'Continue';
  return (
    <Button className="session_buttons" isDisabled={disabled} onClick={onClick}>
      {buttonText}
    </Button>
  );
}

export default ButtonSendFaxes;
