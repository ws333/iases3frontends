import { Request } from 'express';

interface Cookies {
  cookies: {
    session?: string;
  };
}

export interface RequestWithCookies extends Omit<Request, 'cookies'>, Cookies {}

export type Session = {
  email?: string;
  sessionId?: string;
};

// Keep this synced between backend and frontend
export interface LoginGoogleRequest extends RequestWithCookies {
  body: {
    code: string;
  };
}

// Keep this synced between backend and frontend
export interface LoginGoogleResponseBody {
  userEmail?: string;
  error?: string;
}

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
