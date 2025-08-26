import { useLayoutEffect, useMemo, useRef, useState } from 'react';
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

  // The width is used to offset marginLeft of the component displaying active user email
  // A default width different from the width of the button cause a nice slide in effect
  const [buttonWidthGoogle, setButtonWidthGoogle] = useState(0);
  const [buttonWidthMS, setButtonWidthMS] = useState(0);

  const buttonRefGoogle = useRef<HTMLButtonElement>(null);
  const buttonRefMS = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (buttonRefGoogle.current) setButtonWidthGoogle(buttonRefGoogle.current.offsetWidth);
    if (buttonRefMS.current) setButtonWidthMS(buttonRefMS.current.offsetWidth);
  }, [showActiveLoginButtons]);

  const buttonStyles = useMemo(
    () => ({ ...activeUserEmailStyles, marginLeft: buttonWidthGoogle || buttonWidthMS }),
    [buttonWidthGoogle, buttonWidthMS],
  );

  return (
    <div style={outerDivActiveLoginButtonsStyles}>
      {showActiveLoginButtons === 'none' ? null : (
        <div style={divButtonsColumnStyles}>
          {(showActiveLoginButtons === 'both' || showActiveLoginButtons === 'google') && (
            <div style={displayFlexRow}>
              <ButtonGoogle type="continue" onClick={() => onClickUseActiveLogin('Google')} ref={buttonRefGoogle} />
              <Button kind="outlined" isDisabled style={buttonStyles}>
                {isActiveGoogleLogin.userEmail}
              </Button>
            </div>
          )}
          {(showActiveLoginButtons === 'both' || showActiveLoginButtons === 'ms') && (
            <div style={displayFlexRow}>
              <ButtonMS type="continue" onClick={() => onClickUseActiveLogin('MS')} ref={buttonRefMS} />
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
