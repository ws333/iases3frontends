import { defaultFetchTimeout } from '../constants/constants';

type Args = {
  url: string | URL;
  errorMessage: string;
  init?: Omit<RequestInit, 'signal'>;
  timeout?: number;
};

export type FetchWithTimeoutInit = Args['init'];

export async function fetchWithTimeout({ url, errorMessage, init = {}, timeout = defaultFetchTimeout }: Args) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error(errorMessage)), timeout);

  const response = await fetch(url, {
    ...init,
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  return response;
}
