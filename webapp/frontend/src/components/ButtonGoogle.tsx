import { ReactEventHandler } from 'react';
import { Button } from 'ui-kit';
import { ButtonAuthType } from '../types/types';
import googleSignInBtn from '../assets/google/png@1x/dark/web_dark_sq_SI@1x.png';
import googleContinueBtn from '../assets/google/png@1x/dark/web_dark_sq_ctn@1x.png';
import { buttonGoogleStyles } from '../styles/loginStyles';

interface Props {
  type: ButtonAuthType;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onImgLoad?: ReactEventHandler<HTMLImageElement>;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 *  Google button using official design
 */
const ButtonGoogle = ({ type, onClick, onImgLoad, ref }: Props) => {
  const src = type === 'signIn' ? googleSignInBtn : googleContinueBtn;
  const alt = type === 'signIn' ? 'Sign in with Google' : 'Continue with Google';

  return (
    <Button ref={ref} onClick={onClick} style={buttonGoogleStyles} aria-label={alt}>
      <img src={src} alt={alt} onLoad={onImgLoad} />
    </Button>
  );
};

export default ButtonGoogle;
