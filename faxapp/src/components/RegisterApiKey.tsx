import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'ui-kit';
import { msg } from '../constants/constMessages';
import { minPassphraseLength, zeroWidthSpace } from '../constants/constants';
import { checkApiKeyExists, getApiKey, storeApiKey } from '../helpers/crypto';
import { showDeleteApiKeyDialog } from '../helpers/showDeleteApiKeyDialog';
import { store } from '../store/store';
import { toastOptions } from '../styles/styles';
import './RegisterApiKey.css';

function RegisterApiKey() {
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(zeroWidthSpace); // Using zeroWidthSpace to avoid layout shifts

  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [inputPassphraseEnabled, setInputPassphraseEnabled] = useState(true);

  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiValueExists, setApiValueExists] = useState(false);

  const storedPassphrase = useRef('');
  const storedApiKey = useRef('');

  const formRef = useRef<HTMLFormElement>(null);
  const passphraseInputRef = useRef<HTMLInputElement>(null);

  const focusToPassphrase = () => {
    return setTimeout(() => passphraseInputRef.current?.focus(), 100); // Small delay to ensure DOM is ready
  };

  useEffect(() => {
    const timer = focusToPassphrase();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function updateEditMode() {
      if (await checkApiKeyExists()) {
        setApiValueExists(true);

        const decryptedApiKey = await getApiKey(passphrase);
        if (!editMode && !decryptedApiKey) setMessage(msg.enterExisting);

        return;
      }

      setEditMode(true);
      setApiValueExists(false);
    }
    void updateEditMode();
  }, [editMode, passphrase]);

  const setEditMessage = ({ newApiKey: newA = apiKey, newPassphrase: newP = passphrase }) => {
    const spc = storedPassphrase.current;
    const sac = storedApiKey.current;

    // Invalid passphrase
    if (newP.length < minPassphraseLength) return setMessage(msg.passphraseToShort);

    // No API key
    if (!newA && editMode) return setMessage(msg.apiKeyEmpty);

    // Both modified
    if (newP !== spc && newA !== sac) return setMessage(apiValueExists ? msg.bothModified : msg.clickSave);

    // Passphrase modified
    if (newP !== spc) return setMessage(msg.passphraseModified);

    // API key modified
    if (newA && newA !== sac) return setMessage(msg.apiKeyModified);

    setMessage(msg.editValues);
  };

  const onChangePassphrase = async (e: ChangeEvent<HTMLInputElement>) => {
    const newPassphrase = e.target.value;
    setPassphrase(newPassphrase);

    const keyExists = await checkApiKeyExists();
    const decryptedApiKey = await getApiKey(newPassphrase);

    // Set state if the passphrase decrypted the key - but only once
    if (decryptedApiKey && newPassphrase !== storedPassphrase.current) {
      toast(msg.apiKeyRetrieved, toastOptions);
      setMessage(zeroWidthSpace);
      setInputPassphraseEnabled(false);
      setApiKey(decryptedApiKey);
      storedPassphrase.current = newPassphrase;
      storedApiKey.current = decryptedApiKey;
      return;
    }

    setEditMessage({ newPassphrase });

    if (!editMode && keyExists && !apiKey) return setMessage(msg.enterExisting);
  };

  function onChangeApiKey(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setApiKey(value);
    setEditMessage({ newApiKey: value });
  }

  const onClickDelete = () => {
    const successCb = () => {
      setInputPassphraseEnabled(true);
      setMessage(zeroWidthSpace);
      setPassphrase('');
      setApiKey('');
      setEditMode(false);
      setApiValueExists(false);
      focusToPassphrase();
    };

    showDeleteApiKeyDialog(successCb);
  };

  const saveChanges = async ({ newApiKey = apiKey, newPassphrase = passphrase }) => {
    if (newApiKey !== storedApiKey.current || newPassphrase !== storedPassphrase.current) {
      const result = await storeApiKey({
        apiKey: newApiKey,
        passphrase: newPassphrase,
        overwrite: inputPassphraseEnabled,
      });

      if (result === msg.apiKeyStored) {
        storedApiKey.current = newApiKey;
        storedPassphrase.current = newPassphrase;
      }

      toast(result, toastOptions);
      return result;
    }
  };

  const onClickEditSaveCancel = async () => {
    if (editMode) {
      const result = await saveChanges({});
      if (result && result !== msg.apiKeyStored) return setMessage(result);

      setMessage(zeroWidthSpace);
      setInputPassphraseEnabled(false);
      setShowPassphrase(false);
      setShowApiKey(false);
      setEditMode(false);

      store.getActions().fullPageOverlay.closeOverlay();

      return;
    }

    setEditMode(true);
    setInputPassphraseEnabled(!inputPassphraseEnabled);
    setMessage(msg.editValues);
    focusToPassphrase();
  };

  const inputIsValid = passphrase.length >= minPassphraseLength && apiKey.length;
  const valueHasChanged = apiKey !== storedApiKey.current || passphrase !== storedPassphrase.current;
  const btnEditSaveCancelDisabled = apiValueExists && !inputIsValid;
  const btnToggleShowPassphraseHidden = !editMode && !passphrase && !storedPassphrase.current;
  const btnToggleShowApiKeyHidden = apiValueExists && !apiKey && !storedApiKey.current;

  return (
    <div className="outer-div">
      <form
        ref={formRef}
        method="post"
        action="javascript:void(0)"
        onSubmit={(e) => {
          console.log('Form submit event triggered', e);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && editMode) {
            void onClickEditSaveCancel();
          }
        }}
      >
        <div className="inputs-column">
          <label htmlFor="passPhrase" className="label">
            Passphrase
          </label>
          <div className="input-row">
            <input
              ref={passphraseInputRef}
              id="passPhrase"
              name="password"
              value={passphrase}
              type={showPassphrase ? 'text' : 'password'}
              className="input"
              autoComplete="current-password"
              onChange={(e) => void onChangePassphrase(e)}
              disabled={!inputPassphraseEnabled}
              placeholder={apiValueExists ? msg.enterExisting : msg.enterPassphrase}
            />
            <Button
              onClick={() => setShowPassphrase(!showPassphrase)}
              className="button-toggle-show"
              kind="ghost"
              disabled={btnToggleShowPassphraseHidden}
              isDisabled={btnToggleShowPassphraseHidden}
            >
              {btnToggleShowPassphraseHidden ? '' : showPassphrase ? 'Hide' : 'Show'}
            </Button>
          </div>

          <label htmlFor="apiKey" className="label">
            API key
          </label>
          <div className="input-row">
            <input
              id="apiKey"
              name="API key"
              value={apiKey}
              type={showApiKey ? 'text' : 'password'}
              disabled={!editMode || (!storedApiKey.current && apiValueExists)}
              onChange={onChangeApiKey}
              placeholder={apiValueExists && !editMode ? '•'.repeat(33) : msg.enterApiKey}
              autoComplete="off"
              className="input"
            />

            <Button
              onClick={() => setShowApiKey(!showApiKey)}
              className="button-toggle-show"
              kind="ghost"
              disabled={btnToggleShowApiKeyHidden}
              isDisabled={btnToggleShowApiKeyHidden}
            >
              {btnToggleShowApiKeyHidden ? '' : showApiKey ? 'Hide' : 'Show'}
            </Button>
          </div>
          <p className="p-description">{msg.apiKeyInfo}</p>

          <p className="p-message">{message}</p>

          <div className="button-row">
            <Button onClick={onClickDelete} className="button-delete" kind="alert">
              Delete existing API key
            </Button>
            <Button
              onClick={() => void onClickEditSaveCancel()}
              className="button-edit-save"
              disabled={btnEditSaveCancelDisabled}
              isDisabled={btnEditSaveCancelDisabled}
            >
              {editMode ? (valueHasChanged && inputIsValid ? 'Save' : 'Cancel') : 'Edit'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterApiKey;
