import RegisterApiKey from '../components/RegisterApiKey';
import { store } from '../store/store';

export function showRegisterFaxApiKey() {
  const { showOverlay } = store.getActions().fullPageOverlay;

  showOverlay({
    title: 'Register or edit API key for fax service',
    Component: RegisterApiKey,
  });
}
