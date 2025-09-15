import { minPassphraseLength } from './constants';

const cs = 'Click Save or press the Enter key to store the new value!';
const apiRetrieved = 'API key retrieved successfully!';
const enterExisting = 'Enter passphrase for existing API key';

export const msg = {
  clickSave: cs,
  apiKeyDeleted: 'API key deleted successfully!',
  apiKeyEmpty: 'The API key cannot be empty!',
  apiKeyInfo: 'The API key is stored encrypted on your computer',
  apiKeyRetrieved: apiRetrieved,
  apiKeyModified: `API key modified! ${cs}`,
  apiKeyStored: 'API key stored securely!',
  bothModified: `Passphrase and API key modified! ${cs.slice(0, -1)}s!`,
  editValues: 'Edit the passphrase and/or API key',
  enterApiKey: 'Enter API key',
  enterExisting,
  enterExistingToEdit: `${enterExisting} to view or edit the values`,
  enterPassphrase: 'Enter new passphrase',
  errorDeletingApiKey: 'Error deleting API key',
  errorDecryptingApiKey: 'Error decrypting API key',
  incorrectPassphrase: 'Incorrect passphrase',
  missingPassphrase: 'Missing passphrase',
  missingApiKey: 'Missing API key',
  passphraseCorrectReady: `${apiRetrieved}\n\nThe app is now ready to send faxes`,
  passphraseModified: `Passphrase modified. ${cs}`,
  passphraseToShort: `Passphrase must be at least ${minPassphraseLength} characters long`,
};
