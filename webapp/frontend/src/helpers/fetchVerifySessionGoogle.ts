import { IsActiveGoogleLogin } from '../types/types';
import { VerifySessionGoogleResponseBody } from '../types/typesBackend';
import { PATH_VERIFY_SESSION_GOOGLE } from '../constants/constantsEndpointPaths';
import { URL_BACKEND } from '../constants/constantsImportMeta';

export async function fetchVerifySessionGoogle(): Promise<IsActiveGoogleLogin> {
  try {
    const urlVerify = `${URL_BACKEND}${PATH_VERIFY_SESSION_GOOGLE}`;
    const res = await fetch(urlVerify, { credentials: 'include' });
    if (!res.ok) return { status: false, userEmail: '' };

    const { valid, userEmail } = (await res.json()) as VerifySessionGoogleResponseBody;
    return { status: valid, userEmail: userEmail ?? '' };
  } catch (error) {
    console.warn(`Error checking for active Google login: ${error}`);
    return { status: false, userEmail: '' };
  }
}
