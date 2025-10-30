import { store } from '../store/store';
import { formatFaxNumber } from './formatRecipientInfo';

export function getContactNameAndNumber(to: string | undefined): string {
  if (!to) return '';
  const contacts = store.getState().contactList.contacts;
  const contact = contacts.find((c) => formatFaxNumber(c.f) === to);
  return contact ? `${contact.n} ${to}` : to;
}
