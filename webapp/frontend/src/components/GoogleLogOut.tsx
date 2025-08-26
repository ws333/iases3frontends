import { googleLogout } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from 'ui-kit';
import { storeOptionsKey } from '../../../../addon/packages/interface/src/helpers/indexedDB';
import { fetchRevokeSessionGoogle } from '../helpers/fetchRevokeSessionGoogle';
import { removeLastLoginButtonClicked } from '../helpers/localstorageHelpers';
import { useStoreActions } from '../store/storeWithHooks';

const GoogleLogOut = () => {
  const resetCurrentLogin = useStoreActions((state) => state.auth.resetCurrentLogin);
  const navigate = useNavigate();

  const { mutateAsync: revokeSession } = useMutation({
    mutationFn: fetchRevokeSessionGoogle,
  });

  const onClickLogout = async () => {
    await revokeSession();
    googleLogout();
    removeLastLoginButtonClicked();
    await storeOptionsKey('', 'countryCode');
    resetCurrentLogin();
    void navigate('/', { replace: true });
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return <Button onClick={onClickLogout}>Logout</Button>;
};

export default GoogleLogOut;
