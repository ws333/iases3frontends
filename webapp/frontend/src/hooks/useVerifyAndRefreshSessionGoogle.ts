import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
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

  const verifyQuery = useQuery({
    queryKey: ['verifySessionGoogle', lastClickedLogin],
    queryFn: verifySessionGoogle,
    enabled: lastClickedLogin === 'Google' && !currentLogin.provider,
    retry: false,
  });

  const refreshMutation = useMutation({
    mutationFn: refreshSessionGoogle,
  });

  useEffect(() => {
    const failedPrefix = 'Failed to verify Google session:';

    if (verifyQuery.data) {
      if (verifyQuery.data.status === 401) {
        // Not authorized, trigger refresh
        refreshMutation.mutate();
      } else if (verifyQuery.data.status !== 200) {
        resetCurrentLogin();
        console.warn(`${failedPrefix} ${verifyQuery.data.status} ${verifyQuery.data.statusText}`);
      } else {
        // Session is valid
        if (
          verifyQuery.data.valid &&
          verifyQuery.data.userEmail &&
          !(currentLogin.provider === 'Google' && currentLogin.userEmail === verifyQuery.data.userEmail)
        ) {
          setCurrentLogin({ provider: 'Google', userEmail: verifyQuery.data.userEmail });
        } else if (!verifyQuery.data.valid || !verifyQuery.data.userEmail) {
          console.warn(`${failedPrefix} ${verifyQuery.data.error}`);
        }
      }
    }

    if (
      refreshMutation.isSuccess &&
      refreshMutation.data.userEmail &&
      !(currentLogin.provider === 'Google' && currentLogin.userEmail === refreshMutation.data.userEmail)
    ) {
      setCurrentLogin({ provider: 'Google', userEmail: refreshMutation.data.userEmail });
    } else if (refreshMutation.isError) {
      resetCurrentLogin();
      console.warn(`${failedPrefix} ${refreshMutation.error}`);
    }
  }, [
    currentLogin.provider,
    currentLogin.userEmail,
    refreshMutation,
    resetCurrentLogin,
    setCurrentLogin,
    verifyQuery.data,
  ]);

  return { verifyInProgessGoogle: verifyQuery.isLoading, lastClickedLogin };
}

// Async function for verifying session
const verifySessionGoogle = async (): Promise<
  VerifySessionGoogleResponseBody & { status: number; statusText: string }
> => {
  const urlVerify = `${URL_BACKEND}${PATH_VERIFY_SESSION_GOOGLE}`;
  const resVerify = await fetch(urlVerify, { credentials: 'include' });
  const data = await resVerify.json();
  return { ...data, status: resVerify.status, statusText: resVerify.statusText };
};

// Async function for refreshing session
const refreshSessionGoogle = async (): Promise<RefreshSessionGoogleResponseBody> => {
  const urlRefresh = `${URL_BACKEND}${PATH_REFRESH_SESSION_GOOGLE}`;
  const resRefresh = await fetch(urlRefresh, { credentials: 'include' });
  return resRefresh.json();
};
