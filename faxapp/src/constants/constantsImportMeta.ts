import { PATH_BASE, SERVER_DEV, SERVER_PROD, URL_BACKEND_PROD } from './constants';
import { PATH_PING } from './constantsEndpointPaths';

/**
 * WARNING: Do NOT import this file in vite.config.ts or anything imported by it!
 * This file uses import.meta.env, which is only available in the Vite app/browser runtime.
 * Importing this in Node (Vite config) will cause build errors.
 *
 * If you see 'Cannot read properties of undefined (reading \"PROD\")',
 * check your import chain for accidental usage in config.
 */

// Runtime check: if import.meta.env is undefined, throw a clear error
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!import.meta?.env) {
  throw new Error(
    'import.meta.env is undefined! Do NOT import constantsImportMeta.ts in vite.config.ts or its imports.',
  );
}

export const URL_FAXAPP_BASE = import.meta.env.PROD ? `${SERVER_PROD}${PATH_BASE}` : `${SERVER_DEV}${PATH_BASE}`;

// Using URL_BACKEND_PROD only since it is processing webhooks from Telnyx
// Possible to use localhost for this using ngrok, but this requires changing webhook url in Telnyx portal.
export const URL_BACKEND = import.meta.env.PROD ? URL_BACKEND_PROD : URL_BACKEND_PROD;

export const URL_BACKEND_PING = `${URL_BACKEND}${PATH_PING}`;
