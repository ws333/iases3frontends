import Handlebars from 'handlebars';
import { Contact } from '../types/types';

/**
 * - Merge the HTML email template with contact data.
 *
 * - Adding a zero-width space (\&#x200B;) to the email text to prevent the email being sent as ascii
 *   which cause any non ascii characters in the senders name to be encoded incorrectly
 */
export function mergeTemplate(template: string, contact: Contact | undefined): string {
  if (!contact) return '';
  const emailTemplate = Handlebars.compile<Contact>(template);
  return emailTemplate({ n: contact.n, e: contact.e }) + '&#x200B;';
}
