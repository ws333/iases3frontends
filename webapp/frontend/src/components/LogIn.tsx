import { useGoogleLogin } from '@react-oauth/google';
import { AccountInfo, IPublicClientApplication } from '../types/types';
import HeaderWithIFO from '../../../../addon/packages/interface/src/components/HeaderWithIFO';
import { setLastLoginButtonClicked } from '../helpers/localstorageHelpers';
import { GOOGLE_LOGIN_CONFIG } from '../auth/authConfigGoogle.ts';
import { loginRequest } from '../auth/authConfigMS';
import { divButtonsColumnStyles, divContainerButtons, outerDivStyles } from '../styles/loginStyles';
import ActiveLoginButtons from './ActiveLoginButtons';
import ButtonGoogle from './ButtonGoogle.tsx';
import ButtonMS from './ButtonMS.tsx';
import Footer from './Footer';

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
    googleLogin();
  };

  return (
    <div style={outerDivStyles}>
      <HeaderWithIFO />
      <div style={divContainerButtons}>
        <div style={divButtonsColumnStyles}>
          <ButtonGoogle type="signIn" onClick={onClickGoogleLogin} />
          <ButtonMS type="signIn" onClick={onClickLoginMS} />
        </div>
        <ActiveLoginButtons accountsMS={accountsMS} />
      </div>
      <Footer />
    </div>
  );
};

export default LogIn;
