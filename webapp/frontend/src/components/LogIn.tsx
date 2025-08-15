import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'ui-kit';
import { AccountInfo, IPublicClientApplication } from '../types/types';
import { DOCS_URL } from '../constants/constantsImportMeta';
import HeaderWithIFO from '../../../../addon/packages/interface/src/components/HeaderWithIFO';
import { setLastLoginButtonClicked } from '../helpers/localstorageHelpers';
import { GOOGLE_LOGIN_CONFIG } from '../auth/authConfigGoogle.ts';
import { loginRequest } from '../auth/authConfigMS';
import {
  buttonDocumentationStyles,
  divButtonsColumnStyles,
  divContainerButtons,
  outerDivStyles,
} from '../styles/loginStyles';
import ActiveLoginButtons from './ActiveLoginButtons';
import ButtonGoogle from './ButtonGoogle.tsx';
import ButtonMS from './ButtonMS.tsx';

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

  const onClickInformation = () => {
    window.location.assign(DOCS_URL);
  };

  const googleLogin = useGoogleLogin(GOOGLE_LOGIN_CONFIG);

  const onClickGoogleLogin = () => {
    setLastLoginButtonClicked('Google');
    googleLogin();
  };

  return (
    <div style={outerDivStyles}>
      <HeaderWithIFO />
      <div style={divContainerButtons}>
        <div style={divButtonsColumnStyles}>
          <Button style={buttonDocumentationStyles} onClick={onClickInformation}>
            Documentation and information
          </Button>
          <ButtonGoogle type="signIn" onClick={onClickGoogleLogin} />
          <ButtonMS type="signIn" onClick={onClickLoginMS} />
        </div>
        <ActiveLoginButtons accountsMS={accountsMS} />
      </div>
    </div>
  );
};

export default LogIn;
