import { toast } from 'react-toastify';
import { zeroWidthSpace } from '../constants/constants';
import TextDeletingData from '../components/dialogTexts/TextDeletingData';
import { store } from '../store/store';
import { toastOptions } from '../styles/styles';
import { resetStorage } from './indexedDB';

export function showDeleteHistoryDialog() {
  const actions = store.getActions();

  actions.userDialog.setUserDialog({
    title: 'Deletion warning!',
    message: TextDeletingData,
    confirmActionText: 'Confirm deletion',
    confirmActionKind: 'alert',
    onConfirm: () => {
      async function handler() {
        const resetOk = await resetStorage();
        if (resetOk) {
          actions.sendingLog.setLog([]);
          actions.render.initiateForcedRender();
          actions.userMessage.setMessage(zeroWidthSpace);
          const message = 'Sending history has been deleted!';
          toast(message, toastOptions);
          console.log(message);
        } else {
          const message = 'Failed to delete history!';
          toast(message, {
            ...toastOptions,
            type: 'error',
          });
        }
      }
      void handler();
    },
  });
}
