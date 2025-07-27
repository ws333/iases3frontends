// WARNING: Do NOT import anything from constantsImportMeta.ts here!
// That file uses import.meta.env, which will break vite.config.ts if imported.
export const URL_BACKEND_DEV = 'http://localhost:5000';
export const URL_BACKEND_PROD = 'https://backend.iase.one';

export { PORT_DEV_WEBAPP } from '../../../../addon/packages/interface/src/constants/constants';
export { PORT_DEV_DOCS } from '../../../../addon/packages/interface/src/constants/constants';
export { SERVER_PROD } from '../../../../addon/packages/interface/src/constants/constants';
export { SERVER_DEV } from '../../../../addon/packages/interface/src/constants/constants';
export { SERVER_DEV_DOCS } from '../../../../addon/packages/interface/src/constants/constants';
export { URL_DOCS_PROD } from '../../../../addon/packages/interface/src/constants/constants';
export { URL_DOCS_DEV } from '../../../../addon/packages/interface/src/constants/constants';

export const PATH_BASE = '/webapp';
export const PATH_PROTECTED = '/authorized';
export const PATH_REDIRECT = `${PATH_BASE}${PATH_PROTECTED}`;

export const ERROR_FAILED_SENDING_EMAIL = `Failed to send email! An unexpected error occured, please contact support.`;
