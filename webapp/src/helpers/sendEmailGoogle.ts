import { Email, StatusBackend } from '../../../addon/packages/interface/src/types/types';
import { SendEmailGoogleResponseBody } from '../types/typesBackend';
import { ERROR_FAILED_SENDING_EMAIL } from '../constants/constants';
import { URL_SEND_EMAIL_GOOGLE } from '../constants/constantsImportMeta';
import { fetchSendEmail } from './fetchSendEmail';
import { sendEmailResponseErrorParser } from './sendEmailResponseErrorParser';

type Args = {
  email: Email;
};

export async function sendEmailGoogle({ email }: Args): Promise<StatusBackend> {
  async function sendEmail(): Promise<StatusBackend> {
    const response = await fetchSendEmail({ url: URL_SEND_EMAIL_GOOGLE, email });

    if (!response.ok) {
      return await sendEmailResponseErrorParser<SendEmailGoogleResponseBody>('Google', response);
    }

    // Message to show in UI
    const { message } = (await response.json()) as SendEmailGoogleResponseBody;
    return { status: 'OK', message: `${message ?? ''} - ${new Date().toLocaleString()}` };
  }

  try {
    return await sendEmail();
  } catch (catchError) {
    const message = ERROR_FAILED_SENDING_EMAIL;
    const error = `Unhandled error in sendEmailGoogle: ${catchError instanceof Error ? catchError.message : catchError}`;
    console.warn(error);
    return { status: 'ERROR', message, error };
  }
}
