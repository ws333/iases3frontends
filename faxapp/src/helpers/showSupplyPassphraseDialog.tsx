import SupplyPassphrase from '../components/SupplyPassphrase';
import { store } from '../store/store';

export function showSupplyPassphraseDialog() {
  const { showOverlay } = store.getActions().fullPageOverlay;

  showOverlay({
    title: 'Enter passphrase',
    Component: SupplyPassphrase,
  });
}
