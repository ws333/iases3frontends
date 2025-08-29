import { Email } from '../../../addon/packages/interface/src/types/types';

interface Args {
  url: string;
  accessToken?: string;
  email: Email;
}

export async function fetchSendEmail({ url, email, accessToken }: Args) {
  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      accessToken,
      to: email.to,
      subject: email.subject,
      emailBody: email.body,
    }),
  });
}
