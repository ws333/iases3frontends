import { StatusBackend } from '../../../addon/packages/interface/src/types/types';
import { PATH_PING } from '../constants/constantsEndpointPaths';
import { URL_BACKEND_PING } from '../constants/constantsImportMeta';
import { fetchWithTimeout } from '../../../addon/packages/interface/src/helpers/fetchWithTimeout';
import { waitRandomSeconds } from '../../../addon/packages/interface/src/helpers/waitRandomSeconds';

const EROR_BACKEND_NOT_RESPONDING: StatusBackend = {
  status: 'ERROR',
  message:
    'There is no connection to the server sending the emails\nVerify that you are online. If you are online, the server is probably down.',
  error: 'Backend not responding to ping! Server might be down or client is offline',
};

export async function pingBackend(): Promise<StatusBackend> {
  const fetchPing = () =>
    fetchWithTimeout({
      url: URL_BACKEND_PING,
      errorMessage: EROR_BACKEND_NOT_RESPONDING.error ?? '',
    });

  // First check if backend is responding
  let responsePing = await fetchPing()
    .catch(async (_error: unknown) => {
      // Try once more
      await waitRandomSeconds();
      responsePing = await fetchPing();
    })
    .catch((_error: unknown) => {
      // Give up and log error
      console.warn(EROR_BACKEND_NOT_RESPONDING.error);
    });

  const pingAnswer = await responsePing?.text();
  return pingAnswer === PATH_PING ? { status: 'OK', message: pingAnswer } : EROR_BACKEND_NOT_RESPONDING;
}
