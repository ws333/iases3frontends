import { Dispatch, useEffect, useRef, useState } from 'react';
import { ContactI3C } from '../types/types';
import { isLocalhost } from '../../../../addon/packages/interface/src/helpers/getSetDevMode';
import { fetchAndMergeContacts, fetchOnlineNations, saveLocalContacts } from '../helpers/contacts';

let firstRender = true;
const runningOnLocalhost = isLocalhost();

const maxCountOptions = [50, 100, 200, 500, 1000];

type UseContactListArgs = {
  setMessage: Dispatch<React.SetStateAction<string>>;
};

function useContactList({ setMessage }: UseContactListArgs) {
  const [contacts, setContacts] = useState<ContactI3C[]>([]);
  const [emailsSent, setEmailsSent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [maxCount, setMaxCount] = useState<number>(maxCountOptions[1]);
  const [nationOptions, setNationOptions] = useState<string[]>([]);
  const [selectedNations, setSelectedNations] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch nations and contacts on first render
  useEffect(() => {
    const controller = new AbortController();
    const loadContacts = async () => {
      try {
        const _nations = await fetchOnlineNations(controller.signal);
        setNationOptions(_nations);
        const merged = await fetchAndMergeContacts(controller.signal);
        setContacts(merged);
        saveLocalContacts(merged);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          console.warn('*Debug* -> EmailSender.tsx -> useEffect fetch error:', error.message);
        }
      }
    };
    void loadContacts();

    return () => {
      if (firstRender && runningOnLocalhost) {
        // Prevent abort on react double render in dev mode
        firstRender = false;
        return;
      }
      controller.abort();
    };
  }, []);

  const selectedContacts = contacts.filter((contact) => selectedNations.includes(contact.na));

  const initialNations = nationOptions.reduce<Record<string, number>>((acc, nation) => {
    return { ...acc, [nation]: 0 };
  }, {});

  const mostRecentUidsSentPerNation = selectedContacts.reduce<Record<string, number>>(
    (acc, contact) =>
      contact.uid > acc[contact.na] && contact.sd ? { [contact.na]: contact.uid } : { [contact.na]: acc[contact.na] },
    initialNations,
  );

  const selectedContactsNotSent = selectedContacts.filter(
    (contact) => !contact.sd && contact.uid > mostRecentUidsSentPerNation[contact.na],
  );

  function getMaxSelectedContactsNotSent() {
    return Math.min(selectedContactsNotSent.length, maxCount);
  }

  function updateMaxSelectedContactsNotSent() {
    maxSelectedContactsNotSent.current = getMaxSelectedContactsNotSent();
  }

  const maxSelectedContactsNotSent = useRef(getMaxSelectedContactsNotSent());

  const nextContactNotSent = selectedContactsNotSent[0] || { n: '', e: '' };

  useEffect(() => {
    if (emailsSent > 0 && emailsSent === maxSelectedContactsNotSent.current) {
      setMessage(`${emailsSent.toString()} emails sent successfully!`);
    }
  }, [emailsSent, setMessage]);

  return {
    contacts,
    setContacts,
    emailsSent,
    isLoading,
    setEmailsSent,
    maxCount,
    maxCountOptions,
    maxSelectedContactsNotSent,
    mostRecentUidsSentPerNation,
    updateMaxSelectedContactsNotSent,
    selectedContacts,
    selectedContactsNotSent,
    nextContactNotSent,
    setMaxCount,
    nationOptions,
    setNationOptions,
    selectedNations,
    setSelectedNations,
    selectAll,
    setSelectAll,
  };
}

export { useContactList };
export type UseContactListReturnType = ReturnType<typeof useContactList>;
