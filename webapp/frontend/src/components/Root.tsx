import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider } from 'easy-peasy';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { DarkLightThemeProvider, GlobalStyle, ThemePreference } from 'ui-kit';
import { PATH_BASE } from '../constants/constants';
import ErrorFallback from '../../../../addon/packages/interface/src/components/ErrorFallback';
import Loading from '../../../../addon/packages/interface/src/components/Loading';
import { setDevModeIfLocalhost } from '../../../../addon/packages/interface/src/helpers/getSetDevMode';
import { PersistentStateKey, usePersistentState } from '../../../../addon/packages/interface/src/state/persistentState';
import { MSAuthProvider } from '../auth/MSAuthProvider';
import { GOOGLE_OAUTH_CLIENT_ID } from '../auth/autoConfigGoogle';
import { store } from '../store/storeWithHooks';
import SetProjectEnvironment from './SetProjectEnvironment';

const queryClient = new QueryClient();

export function Root() {
  setDevModeIfLocalhost();

  const [theme, setTheme] = usePersistentState<ThemePreference>(PersistentStateKey.ThemePreference, 'system');

  return (
    <StoreProvider store={store}>
      <DarkLightThemeProvider value={theme} onChange={setTheme}>
        <GlobalStyle fontFamily={'Tahoma, sans-serif'} />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Loading />}>
            <QueryClientProvider client={queryClient}>
              <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
                <MSAuthProvider>
                  <BrowserRouter basename={PATH_BASE}>
                    <SetProjectEnvironment />
                  </BrowserRouter>
                </MSAuthProvider>
              </GoogleOAuthProvider>
            </QueryClientProvider>
          </Suspense>
          <ToastContainer />
        </ErrorBoundary>
      </DarkLightThemeProvider>
    </StoreProvider>
  );
}
