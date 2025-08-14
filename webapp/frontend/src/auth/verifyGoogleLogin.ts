import { VerifySessionGoogleResponseBody } from '../types/typesBackend';
import { PATH_VERIFY_SESSION_GOOGLE } from '../constants/constantsEndpointPaths';
import { URL_BACKEND } from '../constants/constantsImportMeta';

type ReturnValue = {
  valid: boolean;
  userEmail?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => void;

export async function verifyGoogleLogin(callback?: Callback): Promise<ReturnValue> {
  try {
    const urlVerify = `${URL_BACKEND}${PATH_VERIFY_SESSION_GOOGLE}`;
    const res = await fetch(urlVerify, { credentials: 'include' });
    if (!res.ok) return { valid: false };

    const { valid, userEmail } = (await res.json()) as VerifySessionGoogleResponseBody;

    if (userEmail && callback) callback({ status: valid, userEmail });

    return { valid, userEmail };
  } catch (error) {
    console.warn(`Error checking for active Google login: ${error}`);
    return { valid: false };
  }
}
