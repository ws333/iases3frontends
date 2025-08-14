import { Request } from 'express';

// Keep this synced between backend and frontend
interface Cookies {
  cookies: {
    session?: string;
  };
}

// Keep this synced between backend and frontend
export interface RequestWithCookies extends Omit<Request, 'cookies'>, Cookies {}

// Keep this synced between backend and frontend
export interface VerifySessionGoogleResponseBody {
  valid: boolean;
  userEmail?: string;
  error?: string;
}

// Keep this synced between backend and frontend
export type RefreshSessionGoogleResponseBody = Omit<VerifySessionGoogleResponseBody, 'valid'>;

// Keep this synced between backend and frontend
export interface RevokeSessionGoogleResponseBody {
  error?: string;
}

// Keep this synced between backend and frontend
export interface SendEmailGoogleRequest extends RequestWithCookies {
  body: {
    to: string;
    subject: string;
    emailBody: string; // HTML content
  };
}

// Keep this synced between backend and frontend
export interface SendEmailGoogleResponseBody {
  message?: string;
  error?: string;
}

// Keep this synced between backend and frontend
export interface SendEmailMSRequest extends RequestWithCookies {
  body: {
    accessToken: string;
    to: string;
    subject: string;
    emailBody: string; // HTML content
  };
}

// Keep this synced between backend and frontend
export interface SendEmailMSResponseBody {
  message?: string;
  error?: string;
}
