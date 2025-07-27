import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Button } from 'ui-kit';
import { AccountInfo, IPublicClientApplication, Provider } from '../types/types';
import { PATH_PROTECTED } from '../constants/constants';
import { DOCS_URL } from '../constants/constantsImportMeta';
import HeaderWithIFO from '../../../../addon/packages/interface/src/components/HeaderWithIFO';
import { useDebounceActiveLoginButtons } from '../hooks/useDebounceActiveLoginButtons';
import { useIsActiveGoogleLogin } from '../hooks/useIsActiveGoogleLogin';
import { setLastLoginButtonClicked, setLoginGoogleInProgress } from '../helpers/localstorageHelpers';
import { loginRequest } from '../auth/authConfigMS';
import { GOOGLE_LOGIN_CONFIG } from '../auth/autoConfigGoogle';
import { useStoreActions } from '../store/storeWithHooks';
import {
  divButtonsStylesColumn,
  divButtonsStylesRow,
  divContainerButtons,
  outerDivStyles,
} from '../styles/loginStyles';

interface Props {
  accountsMS: AccountInfo[];
  instanceMS: IPublicClientApplication;
}

const LogIn = ({ accountsMS, instanceMS }: Props) => {
  const navigate = useNavigate();

  const resetCurrentLogin = useStoreActions((state) => state.auth.resetCurrentLogin);

  const onClickLoginMS = () => {
    setLastLoginButtonClicked('MS');
    instanceMS
      .loginRedirect({
        ...loginRequest,
      })
      .catch((error: unknown) => console.warn(error));
  };

  const googleLogin = useGoogleLogin(GOOGLE_LOGIN_CONFIG);

  const onClickGoogleLogin = () => {
    setLastLoginButtonClicked('Google');
    setLoginGoogleInProgress('true');
    googleLogin();
  };

  const onClickUseActiveLogin = (provider: Provider) => {
    resetCurrentLogin();
    setLastLoginButtonClicked(provider);
    void navigate(PATH_PROTECTED, { replace: true });
  };

  const onClickInformation = () => {
    window.location.assign(DOCS_URL);
  };

  const isActiveMSLogin = accountsMS.length > 0;
  const { isActiveGoogleLogin } = useIsActiveGoogleLogin();

  const { showButtons } = useDebounceActiveLoginButtons({ isActiveGoogleLogin, isActiveMSLogin });

  return (
    <div style={outerDivStyles}>
      <HeaderWithIFO />
      <div style={divContainerButtons}>
        <div style={divButtonsStylesRow}>
          <Button onClick={onClickInformation}>Information</Button>
          <Button onClick={onClickGoogleLogin}>Login with Google</Button>
          <Button onClick={onClickLoginMS}>Login with Microsoft</Button>
        </div>
        {showButtons === 'none' ? null : (
          <div style={divButtonsStylesColumn}>
            {(showButtons === 'both' || showButtons === 'ms') && (
              <Button
                kind="outlined"
                style={{ borderColor: 'seagreen', color: 'seagreen' }}
                onClick={() => onClickUseActiveLogin('MS')}
              >
                Use active Microsoft login: {accountsMS[0]?.username}
              </Button>
            )}
            {(showButtons === 'both' || showButtons === 'google') && (
              <Button
                kind="outlined"
                style={{ borderColor: 'seagreen', color: 'seagreen' }}
                onClick={() => onClickUseActiveLogin('Google')}
              >
                Use active Google login: {isActiveGoogleLogin.userEmail}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogIn;
