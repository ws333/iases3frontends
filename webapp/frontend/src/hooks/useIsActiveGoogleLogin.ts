import { useQuery } from '@tanstack/react-query';
import { fetchVerifySessionGoogle } from '../helpers/fetchVerifySessionGoogle';

export function useIsActiveGoogleLogin() {
  const { data = { status: false, userEmail: '' }, ...query } = useQuery({
    queryKey: ['isActiveGoogleLogin'],
    queryFn: fetchVerifySessionGoogle,
  });

  return { isActiveGoogleLogin: data, ...query };
}
