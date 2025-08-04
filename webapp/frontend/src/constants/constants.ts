export const __DEV__ = !import.meta.env.PROD;

export const CONTACTS_CSV_URL = 'https://iase.one/contact_lists/contactsI3C_test.csv';

export const LOCAL_STORAGE_CONTACTS_KEY = 'contactsI3C';

export const NATIONS_CSV_URL = 'https://iase.one/contact_lists/nations.csv';
export const NATIONS_FALLBACK = ['EU', 'FR', 'GB', 'NO'];

// Todo:_Move to addon shared?
const BACKEND_URL_PROD = new URL('https://i3c-backend.onrender.com/send-email');
const BACKEND_URL_DEV = new URL('http://localhost:5000/send-email');

export const URL_SEND_EMAIL = import.meta.env.PROD ? BACKEND_URL_PROD.href : BACKEND_URL_DEV.href;

// Used to send to just one specified contact per session, i.e. disable the use of the contacts list.
export const SINGLE_CONTACT_MODE = import.meta.env.VITE_SINGLE_CONTACT_MODE === '1';
