import {
  PATH_BASE,
  PATH_REDIRECT,
  SERVER_DEV,
  SERVER_PROD,
  URL_BACKEND_DEV,
  URL_BACKEND_PROD,
  URL_DOCS_DEV,
  URL_DOCS_PROD,
} from './constants';
import {
  PATH_LOGIN_GOOGLE_OAUTH2,
  PATH_PING,
  PATH_REFRESH_SESSION_GOOGLE,
  PATH_SEND_EMAIL_GOOGLE,
  PATH_SEND_EMAIL_MS,
  PATH_VERIFY_SESSION_GOOGLE,
} from './constantsEndpointPaths';

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

export const DOCS_URL = import.meta.env.PROD ? URL_DOCS_PROD : URL_DOCS_DEV;

export const URL_WEBAPP_PROTECTED = import.meta.env.PROD
  ? `${SERVER_PROD}${PATH_REDIRECT}`
  : `${SERVER_DEV}${PATH_REDIRECT}`;

export const URL_WEBAPP_BASE = import.meta.env.PROD ? `${SERVER_PROD}${PATH_BASE}` : `${SERVER_DEV}${PATH_BASE}`;

export const URL_BACKEND = import.meta.env.PROD ? URL_BACKEND_PROD : URL_BACKEND_DEV;

export const URL_SEND_EMAIL_GOOGLE = `${URL_BACKEND}${PATH_SEND_EMAIL_GOOGLE}`;
export const URL_SEND_EMAIL_MS = `${URL_BACKEND}${PATH_SEND_EMAIL_MS}`;

export const URI_LOGIN_GOOGLE_REDIRECT = `${URL_BACKEND}${PATH_LOGIN_GOOGLE_OAUTH2}`;

export const URL_BACKEND_PING = `${URL_BACKEND}${PATH_PING}`;

export const URL_VERIFY_SESSION_GOOGLE = `${URL_BACKEND}${PATH_VERIFY_SESSION_GOOGLE}`;

export const URL_REFRESH_SESSION_GOOGLE = `${URL_BACKEND}${PATH_REFRESH_SESSION_GOOGLE}`;
