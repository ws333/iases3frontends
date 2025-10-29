import { MouseEventHandler } from 'react';
import { Button } from 'ui-kit';

type Props = {
  aborted?: boolean;
  checkInProgress?: boolean;
  disabled?: boolean | string;
  onClick: MouseEventHandler;
  leftToQueueCount: number;
};

function ButtonStopSending({ aborted, checkInProgress, disabled, onClick, leftToQueueCount }: Props) {
  const buttonText = aborted || checkInProgress || !leftToQueueCount ? 'Please wait...' : 'Stop queuing';
  return (
    <Button isDisabled={disabled} onClick={onClick}>
      {buttonText}
    </Button>
  );
}

export default ButtonStopSending;
