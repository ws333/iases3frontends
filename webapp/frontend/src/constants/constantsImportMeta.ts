/**
 * Separate file for contants using import.meta as they cause vite bulid error when in
 * constants.ts which is imported by vite.config.ts
 */
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
import { PATH_SEND_EMAIL_GOOGLE, PATH_SEND_EMAIL_MS } from './constantsEndpointPaths';

export const DOCS_URL = import.meta.env.PROD ? URL_DOCS_PROD : URL_DOCS_DEV;

export const REDIRECT_URI = import.meta.env.PROD ? `${SERVER_PROD}${PATH_REDIRECT}` : `${SERVER_DEV}${PATH_REDIRECT}`;

export const POST_LOGOUT_REDIRECT_URI = import.meta.env.PROD
  ? `${SERVER_PROD}${PATH_BASE}`
  : `${SERVER_DEV}${PATH_BASE}`;

export const URL_BACKEND = import.meta.env.PROD ? URL_BACKEND_PROD : URL_BACKEND_DEV;
// export const URL_BACKEND = import.meta.env.PROD ? URL_BACKEND_PROD : URL_BACKEND_PROD;

export const URL_SEND_EMAIL_GOOGLE = `${URL_BACKEND}/${PATH_SEND_EMAIL_GOOGLE}`;
export const URL_SEND_EMAIL_MS = `${URL_BACKEND}/${PATH_SEND_EMAIL_MS}`;
