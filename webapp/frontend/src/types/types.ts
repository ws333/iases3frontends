import { CurrentLogin } from '../../../../addon/packages/interface/src/types/types';
import { VerifySessionGoogleResponseBody } from './typesBackend';

export type ButtonAuthType = 'signIn' | 'continue';

export type IsActiveGoogleLogin = Omit<VerifySessionGoogleResponseBody, 'error'>;

export type LastClickedLoginButton = NonNullable<CurrentLogin['provider']>;

export type LoginDebounceMeasurements = number[];

// Based ob types in react router (not exported)
interface Path {
  pathname: string;
  search: string;
  hash: string;
}
interface Location<State> extends Path {
  state?: State;
  key: string;
}

export type LocationWithState = Location<NavigateState>;

export type NavigateState = { refresh: boolean };

export type ShowActiveLoginButtons = 'both' | 'google' | 'ms' | 'none';

export type { AccountInfo, IPublicClientApplication, InteractionStatus } from '@azure/msal-browser';

export type { Provider } from '../../../../addon/packages/interface/src/types/types';
