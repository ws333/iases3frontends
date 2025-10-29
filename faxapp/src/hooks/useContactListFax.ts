import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchAndMergeContacts, fetchOnlineNations } from '../helpers/fetchAndMergeContacts';
import { getCountryCodeByIP } from '../helpers/getCountryCodeByIP';
import { getCountryCode, getDeletedContacts } from '../helpers/indexedDB';
import { isOnline } from '../helpers/isOnline';
import { useStoreActions, useStoreState } from '../store/store';

function useContactListFax() {
  const contacts = useStoreState((state) => state.contactList.contacts);
  const setContacts = useStoreActions((actions) => actions.contactList.setContacts);
  const selectedContactsNotSent = useStoreState((state) => state.contactList.selectedContactsNotSent);
  const setDeletedContacts = useStoreActions((actions) => actions.contactList.setDeletedContacts);

  const setCountryCode = useStoreActions((actions) => actions.faxOptions.setCountryCode);

  const endSession = useStoreState((state) => state.contactList.endSession);
  const setEndSession = useStoreActions((actions) => actions.contactList.setEndSession);

  const faxesInQueue = useStoreState((state) => state.contactList.faxesInQueue);
  const bumpFaxesInQueue = useStoreActions((state) => state.contactList.bumpFaxesInQueue);

  const faxesSent = useStoreState((state) => state.contactList.faxesSent);
  const setFaxesSent = useStoreActions((actions) => actions.contactList.setFaxesSent);

  const forcedRender = useStoreState((state) => state.render.forcedRender);

  const maxCount = useStoreState((state) => state.faxOptions.maxCount);

  const nationOptions = useStoreState((state) => state.contactList.nationOptions);
  const setNationOptionsFetched = useStoreActions((actions) => actions.contactList.setNationOptionsFetched);
  const selectedNations = useStoreState((state) => state.contactList.selectedNations);

  useSuspenseQuery({
    queryKey: ['isOnline', forcedRender],
    queryFn: async () => await isOnline(),
    retry: 1,
    staleTime: 0,
    gcTime: 0,
  });

  const { data: _nationOptions } = useSuspenseQuery({
    queryKey: ['nations', forcedRender, { shouldFetch: !nationOptions.length }],
    queryFn: async () => fetchOnlineNations(),
  });

  const { data: _contacts } = useSuspenseQuery({
    queryKey: ['contacts', forcedRender, { shouldFetch: !contacts.length }],
    queryFn: async () => fetchAndMergeContacts(),
  });

  const { data: _deletedContacts } = useSuspenseQuery({
    queryKey: ['deletedContacts', forcedRender],
    queryFn: async () => await getDeletedContacts(),
  });

  const { data: _countryCode } = useSuspenseQuery({
    queryKey: ['countryCode', forcedRender],
    queryFn: async () => {
      return 'US';
      const countryCode = await getCountryCodeByIP();
      if (countryCode) return countryCode;
      // Fall back to stored country code if IP lookup fails
      return await getCountryCode();
    },
  });

  useEffect(() => {
    setNationOptionsFetched(_nationOptions);
    setCountryCode(_countryCode === 'GB' ? 'UK' : _countryCode); // Needs to be after setNationOptionsFetched
  }, [_countryCode, _nationOptions, setCountryCode, setNationOptionsFetched]);

  useEffect(() => {
    setContacts(_contacts);
  }, [_contacts, setContacts]);

  useEffect(() => {
    setDeletedContacts(_deletedContacts);
  }, [_deletedContacts, setDeletedContacts]);

  const maxSelectedContactsNotSent = Math.min(selectedContactsNotSent.length, maxCount);
  const nextContactNotSent = selectedContactsNotSent[0] || { n: '', f: '' };

  return {
    endSession,
    setEndSession,
    faxesInQueue,
    bumpFaxesInQueue,
    faxesSent,
    setFaxesSent,
    maxCount,
    maxSelectedContactsNotSent,
    selectedContactsNotSent,
    nextContactNotSent,
    selectedNations,
  };
}

export { useContactListFax };
export type UseContactListReturnType = ReturnType<typeof useContactListFax>;
