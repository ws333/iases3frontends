import { Button } from 'ui-kit';
import { ButtonAuthType } from '../types/types';
import googleSignInBtn from '../assets/google/png@1x/dark/web_dark_sq_SI@1x.png';
import googleContinueBtn from '../assets/google/png@1x/dark/web_dark_sq_ctn@1x.png';
import { buttonGoogleStyles } from '../styles/loginStyles';

interface Props {
  type: ButtonAuthType;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  ref?: React.RefObject<HTMLButtonElement | null>;
}

/**
 *  Google button using official design
 */
const ButtonGoogle = ({ type, onClick, ref }: Props) => {
  const src = type === 'signIn' ? googleSignInBtn : googleContinueBtn;
  const alt = type === 'signIn' ? 'Sign in with Google' : 'Continue with Google';

  return (
    <Button ref={ref} onClick={onClick} style={buttonGoogleStyles} aria-label={alt}>
      <img src={src} alt={alt} />
    </Button>
  );
};

export default ButtonGoogle;
