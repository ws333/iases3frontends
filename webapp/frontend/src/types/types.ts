import { CurrentLogin } from '../../../../addon/packages/interface/src/types/types';

export type IsActiveGoogleLogin = { status: boolean; userEmail: string };

export type LastClickedLoginButton = NonNullable<CurrentLogin['provider']>;

export type LoginDebounceMeasurements = number[];

export type ShowActiveLoginButtons = 'both' | 'google' | 'ms' | 'none';

export type { AccountInfo, IPublicClientApplication, InteractionStatus } from '@azure/msal-browser';

export type { Provider } from '../../../../addon/packages/interface/src/types/types';
