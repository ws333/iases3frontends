import { fullProgressBarDelay } from '../constants/constants';
import { store } from '../store/store';
import { storeActiveContacts } from './indexedDB';
import { updateSessionState } from './sessionState';

export async function updateContactState(toNumber: string, failureReason: string | null) {
  const delay = store.getState().faxOptions.delay;

  const maxCount = store.getState().faxOptions.maxCount;
  const contacts = store.getState().contactList.contacts;

  const faxesSent = store.getState().contactList.faxesSent;
  const setFaxesSent = store.getActions().contactList.setFaxesSent;

  const setContact = store.getActions().contactList.setContact;

  const remainingCountSession = Math.max(0, maxCount - faxesSent);
  const leftToSendCount = contacts.slice(0, remainingCountSession).length;
  const _delay = leftToSendCount > 1 ? delay : fullProgressBarDelay;

  const contact = contacts.find((c) => c.f === toNumber);
  if (contact) {
    // State faxesSent needs to be updated before setContact (to awoid flickering of progressbar max)
    setFaxesSent((count) => {
      const newCount = ++count;
      updateSessionState(newCount, _delay);
      return newCount;
    });

    contact.sd = Date.now();
    contact.sc++;
    if (failureReason) contact.cf1 = failureReason;

    setContact(contact); // Update the contact in state
    await storeActiveContacts(contact); // Update the contact in indexedDB
  } else {
    console.warn(
      `${updateContactState.name} -> fax.delivered, but contact with faxnumber ${toNumber} was not found in contacts!`,
    );
  }
}
