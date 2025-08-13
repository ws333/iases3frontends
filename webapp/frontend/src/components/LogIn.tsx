import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'ui-kit';
import { AccountInfo, IPublicClientApplication } from '../types/types';
import { DOCS_URL } from '../constants/constantsImportMeta';
import HeaderWithIFO from '../../../../addon/packages/interface/src/components/HeaderWithIFO';
import { setLastLoginButtonClicked, setLoginGoogleInProgress } from '../helpers/localstorageHelpers';
import { GOOGLE_LOGIN_CONFIG } from '../auth/authConfigGoogle.ts';
import { loginRequest } from '../auth/authConfigMS';
import { divButtonsStylesRow, divContainerButtons, outerDivStyles } from '../styles/loginStyles';
import ActiveLoginButtons from './ActiveLoginButtons';

interface Props {
  accountsMS: AccountInfo[];
  instanceMS: IPublicClientApplication;
}

const LogIn = ({ accountsMS, instanceMS }: Props) => {
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

  const onClickInformation = () => {
    window.location.assign(DOCS_URL);
  };

  return (
    <div style={outerDivStyles}>
      <HeaderWithIFO />
      <div style={divContainerButtons}>
        <div style={divButtonsStylesRow}>
          <Button onClick={onClickInformation}>Information</Button>
          <Button onClick={onClickGoogleLogin}>Login with Google</Button>
          <Button onClick={onClickLoginMS}>Login with Microsoft</Button>
        </div>
        <ActiveLoginButtons accountsMS={accountsMS} />
      </div>
    </div>
  );
};

export default LogIn;
