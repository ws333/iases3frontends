import { RefreshSessionGoogleResponseBody } from '../types/typesShared';
import { URL_REFRESH_SESSION_GOOGLE } from '../constants/constantsImportMeta';

export async function fetchRefreshSessionGoogle(): Promise<RefreshSessionGoogleResponseBody> {
  try {
    const res = await fetch(URL_REFRESH_SESSION_GOOGLE, { credentials: 'include' });

    const { userEmail, error } = (await res.json()) as RefreshSessionGoogleResponseBody;
    if (error) return { userEmail: '', error };

    return { userEmail };
  } catch (error) {
    console.warn(`Error refreshing Google session: ${error}`);
    return { error: (error as Error).message };
  }
}
