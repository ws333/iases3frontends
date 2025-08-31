import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider } from 'easy-peasy';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';
import { DarkLightThemeProvider, GlobalStyle, ThemePreference } from 'ui-kit';
import ErrorFallback from '../../../addon/packages/interface/src/components/ErrorFallback';
import Loading from '../../../addon/packages/interface/src/components/Loading';
import { setDevModeIfLocalhost } from '../../../addon/packages/interface/src/helpers/getSetDevMode';
import { PersistentStateKey, usePersistentState } from '../../../addon/packages/interface/src/state/persistentState';
import { store } from '../store/store';
import App from './App';

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
              <App />
            </QueryClientProvider>
          </Suspense>
          <ToastContainer />
        </ErrorBoundary>
      </DarkLightThemeProvider>
    </StoreProvider>
  );
}
