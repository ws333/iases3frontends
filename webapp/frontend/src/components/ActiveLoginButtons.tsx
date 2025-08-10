import { useNavigate } from 'react-router-dom';
import { Button } from 'ui-kit';
import { AccountInfo, Provider } from '../types/types';
import { PATH_PROTECTED } from '../constants/constants';
import { useDebounceActiveLoginButtons } from '../hooks/useDebounceActiveLoginButtons';
import { useIsActiveGoogleLogin } from '../hooks/useIsActiveGoogleLogin';
import { setLastLoginButtonClicked } from '../helpers/localstorageHelpers';
import { useStoreActions } from '../../../../addon/packages/interface/src/store/store';
import { divButtonsStylesColumn } from '../styles/loginStyles';

type Props = {
  accountsMS: AccountInfo[];
};

function ActiveLoginButtons({ accountsMS }: Props) {
  const isActiveMSLogin = accountsMS.length > 0;
  const { isActiveGoogleLogin } = useIsActiveGoogleLogin();
  const { showActiveLoginButtons } = useDebounceActiveLoginButtons({ isActiveGoogleLogin, isActiveMSLogin });

  const resetCurrentLogin = useStoreActions((state) => state.auth.resetCurrentLogin);
  const navigate = useNavigate();

  const onClickUseActiveLogin = (provider: Provider) => {
    resetCurrentLogin();
    setLastLoginButtonClicked(provider);
    void navigate(PATH_PROTECTED, { replace: true });
  };

  return (
    <>
      {showActiveLoginButtons === 'none' ? null : (
        <div style={divButtonsStylesColumn}>
          {(showActiveLoginButtons === 'both' || showActiveLoginButtons === 'google') && (
            <Button
              kind="outlined"
              style={{ borderColor: 'seagreen', color: 'seagreen' }}
              onClick={() => onClickUseActiveLogin('Google')}
            >
              Use active Google login: {isActiveGoogleLogin.userEmail}
            </Button>
          )}
          {(showActiveLoginButtons === 'both' || showActiveLoginButtons === 'ms') && (
            <Button
              kind="outlined"
              style={{ borderColor: 'seagreen', color: 'seagreen' }}
              onClick={() => onClickUseActiveLogin('MS')}
            >
              Use active Microsoft login: {accountsMS[0]?.username}
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export default ActiveLoginButtons;
