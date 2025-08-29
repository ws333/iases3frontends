import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { LastClickedLoginButton } from '../types/types';
import { fetchVerifyAndRefreshSessionGoogle } from '../helpers/fetchVerifyAndRefreshSessionGoogle';
import { useStoreActions, useStoreState } from '../store/storeWithHooks';

type Args = { lastClickedLogin: LastClickedLoginButton };

export function useVerifyAndRefreshSessionGoogle({ lastClickedLogin }: Args) {
  const currentLogin = useStoreState((state) => state.auth.currentLogin);
  const setCurrentLogin = useStoreActions((state) => state.auth.setCurrentLogin);

  const [verifyErrorGoogle, setVerifyErrorGoogle] = useState(false);

  const verifyQuery = useQuery({
    queryKey: ['verifySessionGoogle', lastClickedLogin],
    queryFn: fetchVerifyAndRefreshSessionGoogle,
    enabled: lastClickedLogin === 'Google' && !currentLogin.provider,
    retry: false,
  });

  useEffect(() => {
    if (!verifyQuery.data) return;

    const { valid, userEmail, error } = verifyQuery.data;

    if (error) {
      console.warn(error);
      setVerifyErrorGoogle(true);
    }

    if (
      valid &&
      userEmail &&
      !(currentLogin.provider === 'Google' && currentLogin.userEmail === verifyQuery.data.userEmail)
    ) {
      setCurrentLogin({ provider: 'Google', userEmail });
    }
  }, [currentLogin.provider, currentLogin.userEmail, setCurrentLogin, verifyQuery.data]);

  return { verifyInProgessGoogle: verifyQuery.isLoading, verifyErrorGoogle, lastClickedLogin };
}
