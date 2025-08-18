import { VerifySessionGoogleResponseBody } from '../types/typesBackend';
import { URL_VERIFY_SESSION_GOOGLE } from '../constants/constantsImportMeta';
import { fetchRefreshSessionGoogle } from './fetchRefreshSessionGoogle';

export async function fetchVerifyAndRefreshSessionGoogle(): Promise<VerifySessionGoogleResponseBody> {
  try {
    const resVerify = await fetch(URL_VERIFY_SESSION_GOOGLE, { credentials: 'include' });

    const { valid, missingRefreshToken, userEmail, error } =
      (await resVerify.json()) as VerifySessionGoogleResponseBody;

    if (!valid && !missingRefreshToken) {
      const resRefresh = await fetchRefreshSessionGoogle();
      if (resRefresh.error) return { valid: false, error };
      if (resRefresh.userEmail) return { valid: true, userEmail: resRefresh.userEmail };
    }

    return { valid, userEmail, error };
  } catch (error) {
    console.warn(`Error verifying Google session: ${error}`);
    return { valid: false, error: (error as Error).message };
  }
}
