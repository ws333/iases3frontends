export const URL_BACKEND_DEV = 'http://localhost:5000';
export const URL_BACKEND_PROD = 'https://backend.iase.one';

export const PORT_DEV_WEBAPP = 5174;
export const PORT_DEV_DOCS = 5175;
export const SERVER_DEV = `http://localhost:${PORT_DEV_WEBAPP}`;
export const SERVER_DEV_DOCS = `http://localhost:${PORT_DEV_DOCS}`;
export const SERVER_PROD = 'https://iase.one';

const PATH_DOCS = '/webapp/docs';
export const URL_DOCS_DEV = `${SERVER_DEV_DOCS}${PATH_DOCS}`;
export const URL_DOCS_PROD = `${SERVER_PROD}${PATH_DOCS}`;

export const PATH_BASE = '/webapp';
export const PATH_PROTECTED = '/authorized';
export const PATH_REDIRECT = `${PATH_BASE.substring(1)}${PATH_PROTECTED}`;

export const ERROR_FAILED_SENDING_EMAIL = `Failed to send email! An unexpected error occured, please contact support.`;
