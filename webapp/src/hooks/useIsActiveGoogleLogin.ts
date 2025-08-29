import { useQuery } from '@tanstack/react-query';
import { fetchVerifyAndRefreshSessionGoogle } from '../helpers/fetchVerifyAndRefreshSessionGoogle';

export function useIsActiveGoogleLogin() {
  const { data = { valid: false, userEmail: '' }, ...query } = useQuery({
    queryKey: ['isActiveGoogleLogin'],
    queryFn: fetchVerifyAndRefreshSessionGoogle,
  });

  return { isActiveGoogleLogin: data, ...query };
}
