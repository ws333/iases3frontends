import { TypeOptions, toast } from 'react-toastify';
import { msg } from '../constants/constMessages';
import TextDeletingApiKey from '../components/dialogTexts/TextDeletingApiKey';
import { store } from '../store/store';
import { toastOptions } from '../styles/styles';
import { deleteApiKey } from './crypto';

export function showDeleteApiKeyDialog(successCallback: () => void) {
  const actions = store.getActions();

  const onConfirm = async () => {
    const error = await deleteApiKey();
    const type: TypeOptions = error ? 'error' : 'info';
    const message = error ? error : msg.apiKeyDeleted;
    toast(message, { ...toastOptions, type });
    if (!error) successCallback();
  };

  actions.userDialog.setUserDialog({
    title: 'Deletion warning!',
    message: TextDeletingApiKey,
    confirmActionText: 'Confirm deletion',
    confirmActionKind: 'alert',
    onConfirm: () => void onConfirm(),
  });
}
