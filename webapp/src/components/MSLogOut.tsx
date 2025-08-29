import { Button } from 'ui-kit';
import { IPublicClientApplication } from '../types/types';
import { URL_WEBAPP_BASE } from '../constants/constantsImportMeta';
import { storeOptionsKey } from '../../../addon/packages/interface/src/helpers/indexedDB';
import { removeLastLoginButtonClicked } from '../helpers/localstorageHelpers';
import { useStoreActions } from '../store/storeWithHooks';

type Props = {
  instance: IPublicClientApplication;
};

const MSLogOut = ({ instance }: Props) => {
  const resetCurrentLogin = useStoreActions((state) => state.auth.resetCurrentLogin);

  const onClickLogout = () => {
    removeLastLoginButtonClicked();
    void storeOptionsKey('', 'countryCode');

    instance
      .logoutRedirect({
        account: instance.getActiveAccount(),
        postLogoutRedirectUri: URL_WEBAPP_BASE,
      })
      .then(() => {
        resetCurrentLogin();
      })
      .catch((error: unknown) => console.warn('Error logging out:', error));
  };

  return <Button onClick={onClickLogout}>Logout</Button>;
};

export default MSLogOut;
