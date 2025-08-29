import { StatusBackend } from '../../../addon/packages/interface/src/types/types';
import { fetchVerifyAndRefreshSessionGoogle } from './fetchVerifyAndRefreshSessionGoogle';

export async function sendEmailPreflightFnGoogle(): Promise<StatusBackend> {
  const result = await fetchVerifyAndRefreshSessionGoogle();

  if (!result.valid) {
    return {
      status: 'ERROR',
      message: `Unable to send emails!\nYou're either offline or your Google login needs to be refreshed\nPlease log out and then log in again before retrying`,
      error: result.error,
    };
  }

  return { status: 'OK' };
}
