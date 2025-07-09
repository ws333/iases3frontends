import { ContactI3C } from '../types/types';

export async function fetchSendEmail(
  url: string,
  accessToken: string,
  contact: ContactI3C,
  emailText: string,
  selectedSubject: string,
) {
  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accessToken,
      to: contact.e,
      subject: selectedSubject,
      text: emailText,
      nation: contact.na,
      uid: contact.uid,
    }),
  });
}
