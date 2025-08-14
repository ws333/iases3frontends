import { useEffect, useState } from 'react';
import { IsActiveGoogleLogin } from '../types/types';
import { verifyGoogleLogin } from '../auth/verifyGoogleLogin';

export function useIsActiveGoogleLogin() {
  const [isActiveGoogleLogin, setIsActiveGoogleLogin] = useState<IsActiveGoogleLogin>({ status: false, userEmail: '' });

  useEffect(() => {
    void verifyGoogleLogin(setIsActiveGoogleLogin);
  }, []);

  return { isActiveGoogleLogin };
}
