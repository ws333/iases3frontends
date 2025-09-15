import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'ui-kit';
import { msg } from '../constants/constMessages';
import { getApiKey } from '../helpers/crypto';
import { useStoreActions } from '../store/store';
import { toastOptions } from '../styles/styles';
import './SupplyPassphrase.css';

function SupplyPassphrase() {
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [inputPassphraseEnabled, setInputPassphraseEnabled] = useState(true);

  const setApiKey = useStoreActions((actions) => actions.faxOptions.setApiKey);
  const closeOverlay = useStoreActions((actions) => actions.fullPageOverlay.closeOverlay);

  const formRef = useRef<HTMLFormElement>(null);
  const passphraseInputRef = useRef<HTMLInputElement>(null);

  const focusToPassphrase = () => {
    return setTimeout(() => passphraseInputRef.current?.focus(), 100); // Small delay to ensure DOM is ready
  };

  useEffect(() => {
    const timer = focusToPassphrase();
    return () => clearTimeout(timer);
  }, []);

  const onChangePassphrase = async (e: ChangeEvent<HTMLInputElement>) => {
    const newPassphrase = e.target.value;
    setPassphrase(newPassphrase);

    const decryptedApiKey = await getApiKey(newPassphrase);

    // Set state if the passphrase decrypted the key
    if (decryptedApiKey) {
      toast(msg.passphraseCorrectReady, toastOptions);
      setInputPassphraseEnabled(false);
      setApiKey(decryptedApiKey);
      closeOverlay();
      return;
    }
  };

  const btnToggleShowPassphraseHidden = !passphrase;

  return (
    <div className="passphrase-outer-div">
      <form ref={formRef} method="post" action="javascript:void(0)">
        <div className="passphrase-inputs-column">
          <div className="passphrase-input-row">
            <input
              ref={passphraseInputRef}
              id="passPhrase"
              name="password"
              value={passphrase}
              type={showPassphrase ? 'text' : 'password'}
              className="passphrase-input"
              autoComplete="current-password"
              onChange={(e) => void onChangePassphrase(e)}
              disabled={!inputPassphraseEnabled}
              placeholder={msg.enterExisting}
            />
            <Button
              onClick={() => setShowPassphrase(!showPassphrase)}
              className="passphrase-button-toggle-show"
              kind="ghost"
              disabled={btnToggleShowPassphraseHidden}
              isDisabled={btnToggleShowPassphraseHidden}
            >
              {btnToggleShowPassphraseHidden ? '' : showPassphrase ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SupplyPassphrase;
