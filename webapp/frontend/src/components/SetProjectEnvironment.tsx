import { Route, Routes } from 'react-router-dom';
import { ProjectEnvironment } from '../../../../addon/packages/interface/src/types/types';
import { PATH_PROTECTED } from '../constants/constants';
import App from '../../../../addon/packages/interface/src/components/App';
import { useCurrentLogin } from '../hooks/useCurrentLogin';
import { pingBackend } from '../helpers/pingBackend';
import GoogleLoggedInAs from './GoogleLoggedInAs';
import LogIn from './LogIn';
import MSLoggedInAs from './MSLoggedInAs';
import Page404 from './Page404';
import ProtectedRoute from './ProtectedRoute';

function SetProjectEnvironment() {
  const environment: ProjectEnvironment = 'webapp';

  const { accounts, userEmail, provider, sendEmailFn } = useCurrentLogin();

  const sendEmailPreflightFn = pingBackend;

  const InfoComponent =
    provider === 'MS' ? <MSLoggedInAs accounts={accounts} /> : <GoogleLoggedInAs userEmail={userEmail} />;

  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path={PATH_PROTECTED}
          element={
            <App
              environment={environment}
              sendEmailFn={sendEmailFn}
              sendEmailPreflightFn={sendEmailPreflightFn}
              InfoComponent={InfoComponent}
            />
          }
        />
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default SetProjectEnvironment;
