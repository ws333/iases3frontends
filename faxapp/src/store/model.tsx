import { action, computed, thunk, thunkOn } from 'easy-peasy';
import type { Model, StateActionContactList } from '../types/modelTypes';
import {
  defaultDialogMaxWidth,
  defaultDialogWidth,
  defaultMaxCount,
  defaultSendingDelay,
  faxesInQueueCounterKey,
  zeroWidthSpace,
} from '../constants/constants';
import { defaultLanguage, defaultLanguageOptions, faxComponents } from '../constants/faxTemplates';
import { threeMonths } from '../constants/timeConstants';
import Overlay from '../components/Overlay';
import TextEndingSession from '../components/dialogTexts/TextEndingSession';
import { getDateTime } from '../helpers/getDateTime';
import { storeOptionsKey, storeSendingLog } from '../helpers/indexedDB';
import { getLogsToDisplay } from '../helpers/sendingLog';

export const model: Model = {
  userDialog: {
    title: '',
    message: '',
    confirmActionText: 'Confirm',
    isOpen: false,
    closeDialog: thunk((actions) => actions.setUserDialog({ ...model.userDialog })),
    setUserDialog: action((state, payload) => ({ ...state, isOpen: true, ...payload })),
    showConfirmationModal: true,
    confirmActionKind: 'primary',
    width: defaultDialogWidth,
    maxWidth: defaultDialogMaxWidth,
  },
  userMessage: {
    message: zeroWidthSpace,
    setMessage: action((state, payload) => ({
      ...state,
      message: payload,
    })),
  },
  fullPageOverlay: {
    isOpen: false,
    title: '',
    Component: null,
    content: computed((state) => {
      if (state.Component === null) return null;
      return <Overlay Component={state.Component} title={state.title} />;
    }),
    OverlayComponent: Overlay,
    closeOverlay: thunk((actions) => actions.showOverlay({ isOpen: false, title: '', Component: null })),
    showOverlay: action((state, payload) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content: _, ...restPayload } = payload;
      if (restPayload.Component === null || restPayload.Component === undefined) return { ...state, ...restPayload };
      return { ...state, isOpen: true, ...restPayload };
    }),
  },
  contactList: {
    contacts: [],
    setContact: action((state, payload) => ({
      ...state,
      contacts: state.contacts.map((contact) => (contact.uid === payload.uid ? payload : contact)),
    })),
    setContacts: action((state, payload) => ({ ...state, contacts: [...payload] })),
    selectedContacts: computed([(state) => state, (_state, storeState) => storeState], (state, storeState) =>
      state.contacts.filter((contact) => storeState.contactList.selectedNations.includes(contact.na)),
    ),
    selectedContactsNotSent: computed((state) => {
      const threeMonthsAgo = Date.now() - threeMonths;
      return state.selectedContacts.filter((contact) => contact.sd < threeMonthsAgo);
    }),

    deletedContacts: [],
    setDeletedContacts: action((state, payload) => ({ ...state, deletedContacts: [...payload] })),

    faxesInQueue: parseInt(localStorage.getItem(faxesInQueueCounterKey) ?? '0', 10),
    bumpFaxesInQueue: action((state) => {
      const newState: StateActionContactList = {
        ...state,
        faxesInQueue: state.faxesInQueue + 1,
      };
      localStorage.setItem(faxesInQueueCounterKey, newState.faxesInQueue.toString());
      return newState;
    }),
    decrementFaxesInQueue: action((state) => {
      const newState: StateActionContactList = {
        ...state,
        faxesInQueue: state.faxesInQueue - 1,
      };
      localStorage.setItem(faxesInQueueCounterKey, newState.faxesInQueue.toString());
      return newState;
    }),
    setFaxesInQueue: action((state, payload) => {
      const newFaxesInQueue = typeof payload === 'number' ? payload : payload(state.faxesInQueue);
      const newState: StateActionContactList = {
        ...state,
        faxesInQueue: newFaxesInQueue,
      };
      localStorage.setItem(faxesInQueueCounterKey, newState.faxesInQueue.toString());
      return newState;
    }),

    faxesSent: 0,
    setFaxesSent: action((state, payload) => ({
      ...state,
      faxesSent: typeof payload === 'number' ? payload : payload(state.faxesSent),
    })),

    endSession: false,
    setEndSession: action((state, payload) => ({ ...state, endSession: payload })),

    nationOptions: [],
    setNationOptions: action((state, payload) => ({ ...state, nationOptions: [...payload.sort()] })),
    updateSelectedNations: thunkOn(
      (actions) => actions.setNationOptions,
      (actions, target, { getState }) => {
        const state = getState();
        const selected = state.selectedNations.filter((nation) => target.payload.includes(nation));
        actions.setSelectedNations(selected);
      },
    ),
    nationOptionsByCountryCode: computed(
      [(state) => state, (_state, storeState) => storeState],
      (_state, storeState) => {
        const nobcc: string[] = [];
        const { countryCode } = storeState.faxOptions;
        const { nationOptionsFetched } = storeState.contactList;
        if (nationOptionsFetched.includes(countryCode)) nobcc.push(countryCode);
        return nobcc;
      },
    ),

    nationOptionsFetched: [],
    setNationOptionsFetched: action((state, payload) => ({ ...state, nationOptionsFetched: [...payload] })),
    updateNationOptions: thunkOn(
      (actions) => actions.setNationOptionsFetched,
      (actions, target) => {
        actions.setNationOptions([...target.payload]);
        void storeOptionsKey(target.payload, 'countryCodesFetched');
      },
    ),

    selectedNations: [],
    setSelectedNations: action((state, payload) => ({ ...state, selectedNations: [...payload] })),
    setSelectedNation: action((state, payload) => {
      const { checked, nation } = payload;

      return {
        ...state,
        selectedNations: checked
          ? [...state.selectedNations, nation]
          : state.selectedNations.filter((n) => n !== nation),
      };
    }),
    updateIsSelectedAllNations: thunkOn(
      (actions) => [actions.setSelectedNation, actions.setSelectedNations],
      (actions, _target, { getState }) => {
        const state = getState();

        const checked =
          (state.isSelectedAllNations && state.selectedNations.length !== 0) ||
          (!state.isSelectedAllNations && state.selectedNations.length === state.nationOptions.length);

        // Don't update unless there is a change since the action also sets selectedNations
        if (checked !== state.isSelectedAllNations) {
          actions.setIsSelectedAllNations(checked);
        }
      },
    ),

    isSelectedAllNations: false,
    setIsSelectedAllNations: action((state, payload) => ({
      ...state,
      isSelectedAllNations: payload,
      selectedNations: payload ? [...state.nationOptions] : [],
    })),
    toggleIsSelectedAllNations: thunk((actions, _, { getState }) => {
      const state = getState();
      actions.setIsSelectedAllNations(!state.isSelectedAllNations);
    }),
  },
  faxOptions: {
    apiKey: '',
    setApiKey: action((state, payload) => ({ ...state, apiKey: payload })),

    countryCode: '',
    setCountryCode: action((state, payload) => ({ ...state, countryCode: payload })),
    updateNationAndLanguageOptions: thunkOn(
      (actions) => actions.setCountryCode,
      (actions, target, { getStoreState, getStoreActions }) => {
        const storeState = getStoreState();
        const storeActions = getStoreActions();

        const newLanguageOptions = [...defaultLanguageOptions];
        actions.setLanguageOptions(newLanguageOptions);

        void storeOptionsKey(target.payload, 'countryCode');
        storeActions.contactList.setNationOptions(storeState.contactList.nationOptionsByCountryCode);
      },
    ),

    delay: defaultSendingDelay,
    setDelay: action((state, payload) => ({ ...state, delay: payload })),
    storeDelay: thunkOn(
      (actions) => actions.setDelay,
      (_actions, target) => {
        void storeOptionsKey(target.payload, 'delay');
      },
    ),

    maxCount: defaultMaxCount,
    _setMaxCount: action((state, payload) => ({ ...state, maxCount: payload })), // Internal use only, use setMaxCount to update state.
    setMaxCount: thunk((actions, payload, { getStoreState, getStoreActions }) => {
      const storeState = getStoreState();
      const storeActions = getStoreActions();
      if (payload <= storeState.contactList.faxesSent) {
        storeActions.userDialog.setUserDialog({
          title: 'Ending session!',
          message: TextEndingSession,
          onConfirm: () => {
            actions._setMaxCount(payload);
            storeActions.contactList.setEndSession(true);
          },
        });
        return;
      }
      actions._setMaxCount(payload);
      void storeOptionsKey(payload, 'maxCount');
      return { ...storeState, maxCount: payload };
    }),

    language: defaultLanguage,
    setLanguage: action((state, payload) => ({
      ...state,
      language: payload.language,
    })),
    storeLanguageAndUpdateNationOptions: thunkOn(
      (actions) => actions.setLanguage,
      (_actions, target, { getStoreState, getStoreActions }) => {
        const storeState = getStoreState();
        const storeActions = getStoreActions();

        storeActions.contactList.setNationOptions(storeState.contactList.nationOptionsByCountryCode);

        void storeOptionsKey(target.payload.language, 'language');
      },
    ),

    languageOptions: defaultLanguageOptions,
    setLanguageOptions: action((state, payload) => ({ ...state, languageOptions: [...payload] })),
    updateLanguage: thunkOn(
      (actions) => actions.setLanguageOptions,
      (actions, target) => {
        actions.setLanguage({ language: target.payload[0] });
      },
    ),

    FaxComponent: computed((state) => faxComponents[state.language]),
  },
  render: {
    forcedRender: 1,
    initiateForcedRender: action((state) => ({ ...state, forcedRender: state.forcedRender + 1 })),
  },
  sendingLog: {
    log: await getLogsToDisplay(),
    setLog: action((state, payload) => ({
      ...state,
      log: [...payload],
    })),
    fetchLog: thunk(async (actions) => {
      const logs = await getLogsToDisplay();
      actions.setLog(logs);
    }),
    addLogItem: thunk(async (actions, payload, { getState }) => {
      const { message, addNewline } = payload;
      const state = getState();

      const timestamp = Date.now();
      const messageWithTime = `${getDateTime(timestamp)} - ${message}`;
      const newValue = [messageWithTime, ...state.log];
      const newStorageEntry = [{ message, timestamp }];

      if (addNewline) {
        newValue.unshift(zeroWidthSpace);
        newStorageEntry.push({ message: zeroWidthSpace, timestamp: timestamp + 1 });
      }

      await storeSendingLog(newStorageEntry);
      actions.setLog(newValue);
    }),
  },
};
