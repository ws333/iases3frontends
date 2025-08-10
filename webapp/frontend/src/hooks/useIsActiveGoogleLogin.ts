import { useEffect, useState } from 'react';
import { IsActiveGoogleLogin } from '../types/types';
import { VerifySessionGoogleResponseBody } from '../types/typesBackend';
import { PATH_VERIFY_SESSION_GOOGLE } from '../constants/constantsEndpointPaths';
import { URL_BACKEND } from '../constants/constantsImportMeta';

export function useIsActiveGoogleLogin() {
  const [isActiveGoogleLogin, setIsActiveGoogleLogin] = useState<IsActiveGoogleLogin>({ status: false, userEmail: '' });

  useEffect(() => {
    void (async () => {
      try {
        const urlVerify = `${URL_BACKEND}/${PATH_VERIFY_SESSION_GOOGLE}`;
        const res = await fetch(urlVerify, { credentials: 'include' });
        if (!res.ok) return;

        const { valid, userEmail } = (await res.json()) as VerifySessionGoogleResponseBody;
        if (userEmail) {
          setIsActiveGoogleLogin({ status: valid, userEmail });
        }
      } catch (error) {
        console.warn(`Error checking for active Google login: ${error}`);
      }
    })();
  }, []);

  return { isActiveGoogleLogin };
}
