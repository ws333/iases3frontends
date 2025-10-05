import { Button } from 'ui-kit';
import { ButtonAuthType } from '../types/types';
import msLogo from '../assets/ms/ms-symbollockup_mssymbol_19.png';
import { buttonLogoMSStyles, buttonMSStyles, buttonSpanMSStyles } from '../styles/loginStyles';

interface Props {
  type: ButtonAuthType;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onLoad?: React.ReactEventHandler<HTMLButtonElement>;
  ref?: React.RefObject<HTMLButtonElement | null>;
}

function ButtonMS({ type, onClick, onLoad, ref }: Props) {
  // Match design of official Google buttons for consistent layout
  const width = type === 'signIn' ? 175 : 189;
  const text = type === 'signIn' ? 'Sign in with Microsoft' : 'Continue with Microsoft';

  return (
    <Button ref={ref} onClick={onClick} onLoad={onLoad} style={{ ...buttonMSStyles, width }} aria-label={text}>
      <img src={msLogo} alt={text} style={buttonLogoMSStyles} />
      <span style={buttonSpanMSStyles}>{text}</span>
    </Button>
  );
}

export default ButtonMS;
