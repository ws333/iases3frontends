import { useEffect, useState } from 'react';
import { LastClickedLoginButton } from '../types/types';
import { RefreshSessionGoogleResponseBody, VerifySessionGoogleResponseBody } from '../types/typesBackend';
import { PATH_REFRESH_SESSION_GOOGLE, PATH_VERIFY_SESSION_GOOGLE } from '../constants/constantsEndpointPaths';
import { URL_BACKEND } from '../constants/constantsImportMeta';
import { useStoreActions, useStoreState } from '../store/storeWithHooks';

type Args = { lastClickedLogin: LastClickedLoginButton };

export function useVerifyAndRefreshSessionGoogle({ lastClickedLogin }: Args) {
  const setCurrentLogin = useStoreActions((state) => state.auth.setCurrentLogin);
  const resetCurrentLogin = useStoreActions((state) => state.auth.resetCurrentLogin);
  const currentLogin = useStoreState((state) => state.auth.currentLogin);

  const [verifyInProgessGoogle, setVerifyInProgressGoogle] = useState(false);

  useEffect(() => {
    async function verifyAndRefreshSessionGoogle(): Promise<void> {
      const failedPrefix = 'Failed to verify Google session:';

      try {
        const urlVerify = `${URL_BACKEND}${PATH_VERIFY_SESSION_GOOGLE}`;
        const resVerify = await fetch(urlVerify, { credentials: 'include' });

        if (resVerify.status === 401) {
          // Not authorized - refresh access token
          const urlRefresh = `${URL_BACKEND}${PATH_REFRESH_SESSION_GOOGLE}`;
          const resRefresh = await fetch(urlRefresh, { credentials: 'include' });

          if (resRefresh.ok) {
            const { userEmail } = (await resRefresh.json()) as RefreshSessionGoogleResponseBody;

            if (userEmail) {
              setCurrentLogin({ provider: 'Google', userEmail });
              return;
            } else {
              console.warn(`${failedPrefix} no userEmail received from backend`);
              resetCurrentLogin();
              return;
            }
          } else {
            // Status for resRefresh is not 200
            console.warn(`${failedPrefix} ${resRefresh.status} ${resRefresh.statusText}`);
            const { error } = (await resRefresh.json()) as RefreshSessionGoogleResponseBody;
            if (error) console.warn(`Error from backend: ${error}`);
            resetCurrentLogin();
            return;
          }
        } else if (!resVerify.ok) {
          // Status for resVerify is not 200 and other than 401 not authorized - reset currentLogin just in case
          resetCurrentLogin();
          console.warn(`${failedPrefix} ${resVerify.status} ${resVerify.statusText}`);
          return;
        }

        // Session is still valid if we get this far
        const { valid, userEmail, error } = (await resVerify.json()) as VerifySessionGoogleResponseBody;

        if (valid && userEmail) {
          setCurrentLogin({ provider: 'Google', userEmail });
        } else {
          console.warn(`${failedPrefix} error: ${error}`);
        }
      } catch (catchError) {
        console.warn(`${failedPrefix} ${catchError}`);
      } finally {
        setVerifyInProgressGoogle(false);
      }
    }

    if (lastClickedLogin === 'Google' && !verifyInProgessGoogle && !currentLogin.provider) {
      setVerifyInProgressGoogle(true);
      void verifyAndRefreshSessionGoogle();
    }
  }, [currentLogin.provider, lastClickedLogin, resetCurrentLogin, setCurrentLogin, verifyInProgessGoogle]);

  return { verifyInProgessGoogle, lastClickedLogin };
}
