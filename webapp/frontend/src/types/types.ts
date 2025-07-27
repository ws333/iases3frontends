import { CurrentLogin } from '../../../../addon/packages/interface/src/types/types';

export type IsActiveGoogleLogin = { status: boolean; userEmail: string };

export type LastLoginButtonValue = NonNullable<CurrentLogin['provider']>;

export type LoginDebounceMeasurements = number[];

export type LoginGoogleInProgress = 'true' | 'cleanedup';

export type { AccountInfo, IPublicClientApplication, InteractionStatus } from '@azure/msal-browser';

export type { Provider } from '../../../../addon/packages/interface/src/types/types';
