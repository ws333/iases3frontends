import { useMsal } from '@azure/msal-react';
import { Email, ProjectEnvProps } from '../../../../addon/packages/interface/src/types/types';
import { sendEmailGoogle } from '../helpers/sendEmailGoogle';
import { sendEmailMS } from '../helpers/sendEmailMS';
import { loginRequest } from '../auth/authConfigMS';
import { useStoreState } from '../store/storeWithHooks';

export function useCurrentLogin() {
  const { accounts, inProgress, instance } = useMsal();
  const { scopes } = loginRequest;

  const currentLogin = useStoreState((state) => state.auth.currentLogin);
  const { provider, userEmail } = currentLogin;

  let sendEmailFn: ProjectEnvProps['sendEmailFn'] = (_email: Email) =>
    new Promise<void>((_resolve, _reject) => {
      throw new Error('Not logged in!');
    });

  if (provider === 'Google') {
    sendEmailFn = async (email: Email) => await sendEmailGoogle({ email });
  }

  if (provider === 'MS') {
    sendEmailFn = async (email: Email) => await sendEmailMS({ email, instance, accounts, scopes });
  }

  return { accountsMS: accounts, inProgressMS: inProgress, instanceMS: instance, userEmail, provider, sendEmailFn };
}
