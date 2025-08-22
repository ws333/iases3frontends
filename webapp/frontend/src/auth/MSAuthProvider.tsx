import { AuthenticationResult, EventMessage, EventType, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import React, { useEffect, useMemo, useState } from 'react';
import { msalConfig } from './authConfigMS';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const MSAuthProvider = ({ children }: AuthProviderProps) => {
  /**
   * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
   * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
   */
  const msalInstance = useMemo(() => new PublicClientApplication(msalConfig), []);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    msalInstance
      .initialize()
      .then(() => {
        if (isMounted) {
          if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
            msalInstance.setActiveAccount(msalInstance.getActiveAccount());
          }
          setInitialized(true);
        }
      })
      .catch((error: unknown) => {
        console.warn('MSAL initialization error:', (error as Error).message);
      });
    return () => {
      isMounted = false;
    };
  }, [msalInstance]);

  // Listen for sign-in event and set active account
  useEffect(() => {
    const callbackId = msalInstance.addEventCallback((event: EventMessage) => {
      const authenticationResult = event.payload as AuthenticationResult | null;
      const account = authenticationResult?.account;
      if (event.eventType === EventType.LOGIN_SUCCESS && account) {
        msalInstance.setActiveAccount(account);
      }
    });
    return () => {
      if (callbackId) msalInstance.removeEventCallback(callbackId);
    };
  }, [msalInstance]);

  if (!initialized) {
    return null; // Or a loading spinner
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};
