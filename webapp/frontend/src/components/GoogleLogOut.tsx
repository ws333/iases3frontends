import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Button } from 'ui-kit';
import { removeLastLoginButtonClicked } from '../helpers/localstorageHelpers';
import { revokeSessionGoogle } from '../helpers/revokeSessionGoogle';
import { useStoreActions } from '../store/storeWithHooks';

const GoogleLogOut = () => {
  const resetCurrentLogin = useStoreActions((state) => state.auth.resetCurrentLogin);
  const navigate = useNavigate();

  const onClickLogout = async () => {
    await revokeSessionGoogle();
    googleLogout();
    removeLastLoginButtonClicked();
    resetCurrentLogin();
    void navigate('/', { replace: true });
  };

  return <Button onClick={onClickLogout}>Logout</Button>;
};

export default GoogleLogOut;
