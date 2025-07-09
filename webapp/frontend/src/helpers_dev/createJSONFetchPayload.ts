/**
 * Used for testing with postman
 */
import { emailTemplates } from '../constants/emailTemplates';
import { mergeTemplate } from '../helpers/mergeTemplate';

const accessToken = 'REPLACE WITH TOKEN';
const email = 'REPLACE WITH EMAIL';

export function createJSONFetchPayload() {
  const payload = JSON.stringify({
    accessToken,
    to: email,
    subject: 'Some random subject',
    text: mergeTemplate(emailTemplates.Norwegian, { n: 'Mr Human Being', e: email }),
    nation: 'None',
    uid: Date.now(),
  });
  console.log(payload);
  return payload;
}

createJSONFetchPayload();
