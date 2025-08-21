import { Navigate, Outlet } from 'react-router-dom';
import { AccountInfo, InteractionStatus } from '../types/types';
import Loading from '../../../../addon/packages/interface/src/components/Loading';
import { useCheckAndSetCurrentLoginMS } from '../hooks/useCheckAndSetCurrentLoginMS';
import { useVerifyAndRefreshSessionGoogle } from '../hooks/useVerifyAndRefreshSessionGoogle';
import { getLastLoginButtonClicked } from '../helpers/localstorageHelpers';
import { useStoreState } from '../store/storeWithHooks';

type Props = {
  accountsMS: AccountInfo[];
  inProgressMS: InteractionStatus;
};

function ProtectedRoute({ accountsMS, inProgressMS }: Props) {
  const currentLogin = useStoreState((state) => state.auth.currentLogin);

  useCheckAndSetCurrentLoginMS();
  const lastClickedLogin = getLastLoginButtonClicked();
  const { verifyInProgessGoogle, verifyErrorGoogle } = useVerifyAndRefreshSessionGoogle({ lastClickedLogin });

  if (
    inProgressMS !== 'none' ||
    (verifyInProgessGoogle && lastClickedLogin === 'Google') ||
    (currentLogin.provider == null && !verifyErrorGoogle && lastClickedLogin === 'Google')
  ) {
    return <Loading showSpinner={false} />;
  }

  const isAuthenticatedGoogle = currentLogin.provider === 'Google' && lastClickedLogin === 'Google';
  const isAuthenticatedMS = accountsMS.length > 0 && lastClickedLogin === 'MS';
  const isAuthenticated = isAuthenticatedMS || isAuthenticatedGoogle;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
