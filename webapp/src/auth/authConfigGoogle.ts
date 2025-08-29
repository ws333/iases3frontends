import { UseGoogleLoginOptionsAuthCodeFlow } from '@react-oauth/google';
import { URI_LOGIN_GOOGLE_REDIRECT } from '../constants/constantsImportMeta';

export const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const GOOGLE_LOGIN_CONFIG: UseGoogleLoginOptionsAuthCodeFlow = {
  flow: 'auth-code',
  ux_mode: 'redirect',
  redirect_uri: URI_LOGIN_GOOGLE_REDIRECT,
  scope: 'openid email profile https://www.googleapis.com/auth/gmail.send',
} as const;
