import { useMsal } from '@azure/msal-react';
import { postLogoutRedirectUri } from '../auth/authConfig';

const LogOut = () => {
  const { instance } = useMsal();

  const onClickLogout = () => {
    instance
      .logoutRedirect({
        account: instance.getActiveAccount(),
        postLogoutRedirectUri,
      })
      .catch((error: unknown) => console.error('Error logging out', error));
  };

  return (
    <button className="logout-button" onClick={onClickLogout}>
      Logout
    </button>
  );
};

export default LogOut;
