import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'ui-kit';
import { AccountInfo, Provider } from '../types/types';
import { PATH_PROTECTED } from '../constants/constants';
import { useDebounceActiveLoginButtons } from '../hooks/useDebounceActiveLoginButtons';
import { useIsActiveGoogleLogin } from '../hooks/useIsActiveGoogleLogin';
import { setLastLoginButtonClicked } from '../helpers/localstorageHelpers';
import {
  activeUserEmailStyles,
  displayFlexRow,
  divButtonsColumnStyles,
  outerDivActiveLoginButtonsStyles,
} from '../styles/loginStyles';
import ButtonGoogle from './ButtonGoogle';
import ButtonMS from './ButtonMS';

type Props = {
  accountsMS: AccountInfo[];
};

function ActiveLoginButtons({ accountsMS }: Props) {
  const isActiveMSLogin = accountsMS.length > 0;
  const { isActiveGoogleLogin } = useIsActiveGoogleLogin();
  const { showActiveLoginButtons } = useDebounceActiveLoginButtons({ isActiveGoogleLogin, isActiveMSLogin });

  const navigate = useNavigate();

  const onClickUseActiveLogin = (provider: Provider) => {
    setLastLoginButtonClicked(provider);
    void navigate(PATH_PROTECTED);
  };

  // The width of ButtonGoogle is used to offset marginLeft for component displaying active user email
  // A default width different from the width of ButtonGoogle cause a nice slide in effect
  const buttonGoogleRef = useRef<HTMLButtonElement>(null);
  const [googleButtonWidth, setGoogleButtonWidth] = useState(0);

  const handleGoogleImgLoad = () => {
    if (buttonGoogleRef.current) {
      setGoogleButtonWidth(buttonGoogleRef.current.offsetWidth);
    }
  };

  const buttonStyles = useMemo(
    () => ({ ...activeUserEmailStyles, marginLeft: googleButtonWidth }),
    [googleButtonWidth],
  );

  return (
    <div style={outerDivActiveLoginButtonsStyles}>
      {showActiveLoginButtons === 'none' ? null : (
        <div style={divButtonsColumnStyles}>
          {(showActiveLoginButtons === 'both' || showActiveLoginButtons === 'google') && (
            <div style={displayFlexRow}>
              <ButtonGoogle
                ref={buttonGoogleRef}
                type="continue"
                onClick={() => onClickUseActiveLogin('Google')}
                onImgLoad={handleGoogleImgLoad}
              />
              <Button kind="outlined" isDisabled style={buttonStyles}>
                {isActiveGoogleLogin.userEmail}
              </Button>
            </div>
          )}
          {(showActiveLoginButtons === 'both' || showActiveLoginButtons === 'ms') && (
            <div style={displayFlexRow}>
              <ButtonMS type="continue" onClick={() => onClickUseActiveLogin('MS')} />
              <Button kind="outlined" isDisabled style={buttonStyles} onClick={() => onClickUseActiveLogin('MS')}>
                {accountsMS[0]?.username}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ActiveLoginButtons;
