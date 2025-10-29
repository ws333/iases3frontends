import { Action, Computed, FilterActionTypes, StateMapper, Thunk, ThunkOn } from 'easy-peasy';
import { JSX } from 'react';
import { ButtonKind } from 'ui-kit';
import type { LanguageOption } from '../constants/faxTemplates.ts';
import Overlay from '../components/Overlay.tsx';
import type { TFaxComponent } from './types.ts';
import type { ContactI3CFax } from './typesI3C.ts';

export interface Model {
  contactList: ContactList;
  faxOptions: FaxOptions;
  fullPageOverlay: FullPageOverlay;
  render: Render;
  sendingLog: SendingLog;
  userDialog: UserDialog;
  userMessage: UserMessage;
}

export type StateActionContactList = StateMapper<FilterActionTypes<ContactList>>;

interface ContactList {
  contacts: ContactI3CFax[];
  setContact: Action<ContactList, ContactI3CFax>;
  setContacts: Action<ContactList, ContactI3CFax[]>;
  selectedContacts: Computed<ContactList, ContactI3CFax[], Model>;
  selectedContactsNotSent: Computed<ContactList, ContactI3CFax[], Model>;

  deletedContacts: ContactI3CFax[];
  setDeletedContacts: Action<ContactList, ContactI3CFax[]>;

  faxesInQueue: number;
  bumpFaxesInQueue: Action<ContactList>;
  decrementFaxesInQueue: Action<ContactList>;
  setFaxesInQueue: Action<ContactList, number | ((prev: number) => number)>;

  faxesSent: number;
  setFaxesSent: Action<ContactList, number | ((prev: number) => number)>;

  endSession: boolean;
  setEndSession: Action<ContactList, boolean>;

  nationOptions: string[];
  setNationOptions: Action<ContactList, string[]>;
  updateSelectedNations: ThunkOn<ContactList>;
  nationOptionsByCountryCode: Computed<ContactList, string[], Model>;

  nationOptionsFetched: string[];
  setNationOptionsFetched: Action<ContactList, string[]>;
  updateNationOptions: ThunkOn<ContactList>;

  selectedNations: string[];
  setSelectedNations: Action<ContactList, string[]>;
  setSelectedNation: Action<ContactList, { nation: string; checked: boolean }>;
  updateIsSelectedAllNations: ThunkOn<ContactList>;

  isSelectedAllNations: boolean;
  setIsSelectedAllNations: Action<ContactList, boolean>;
  toggleIsSelectedAllNations: Thunk<ContactList>;
}

interface FaxOptions {
  apiKey: string;
  setApiKey: Action<FaxOptions, string>;

  countryCode: string;
  setCountryCode: Action<FaxOptions, string>;
  updateNationAndLanguageOptions: ThunkOn<FaxOptions, undefined, Model>;

  delay: number;
  setDelay: Action<FaxOptions, number>;
  storeDelay: ThunkOn<FaxOptions, number>;

  language: LanguageOption;
  setLanguage: Action<FaxOptions, { language: LanguageOption }>;
  storeLanguageAndUpdateNationOptions: ThunkOn<FaxOptions, undefined, Model>;

  languageOptions: LanguageOption[];
  setLanguageOptions: Action<FaxOptions, LanguageOption[]>;
  updateLanguage: ThunkOn<FaxOptions, undefined, Model>;

  FaxComponent: Computed<FaxOptions, TFaxComponent>;

  maxCount: number;
  _setMaxCount: Action<FaxOptions, number>; // Internal use only, use setMaxCount to update state.
  setMaxCount: Thunk<FaxOptions, number, undefined, Model>;
}

interface FullPageOverlay {
  isOpen: boolean;
  title: string;
  content: Computed<FullPageOverlay, JSX.Element | null>;
  showOverlay: Action<FullPageOverlay, Partial<FullPageOverlay>>;
  closeOverlay: Thunk<FullPageOverlay>;
  Component: ((props?: Record<string, unknown>) => JSX.Element) | null;
  OverlayComponent: typeof Overlay;
}

interface Render {
  forcedRender: number;
  initiateForcedRender: Action<Render>;
}

interface SendingLog {
  log: string[];
  setLog: Action<SendingLog, string[]>;
  fetchLog: Thunk<SendingLog>;
  addLogItem: Thunk<SendingLog, { message: string; addNewline?: boolean }>;
}

export interface UserDialog {
  title?: string;
  message: string | JSX.Element;
  confirmActionText?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  closeDialog: Thunk<UserDialog>;
  setUserDialog: Action<UserDialog, Partial<UserDialog>>;
  showConfirmationModal?: boolean;
  confirmActionKind: ButtonKind;
  showConfirm?: boolean;
  showCancel?: boolean;
  width: number;
  maxWidth: number;
}

interface UserMessage {
  message: string;
  setMessage: Action<UserMessage, string>;
}
