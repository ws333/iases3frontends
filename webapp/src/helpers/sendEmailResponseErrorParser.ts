import { Provider, StatusBackend } from '../../../addon/packages/interface/src/types/types';
import { SendEmailGoogleResponseBody, SendEmailMSResponseBody } from '../types/typesShared';

export async function sendEmailResponseErrorParser<T extends SendEmailMSResponseBody | SendEmailGoogleResponseBody>(
  provider: Provider,
  response: Response,
): Promise<StatusBackend> {
  const { error: responseError, message: responseMessage } = (await response.json()) as T;
  console.warn(`sendEmail${provider} -> Message from backend:`, responseError);
  const message = `Failed to send email! ${responseMessage}`;
  const error = `HTTP error: ${response.status} - Error from backend: ${responseError}`;
  return { status: 'ERROR', message, error, httpStatus: response.status };
}
