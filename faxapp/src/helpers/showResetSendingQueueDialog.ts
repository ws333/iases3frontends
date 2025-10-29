import { toast } from 'react-toastify';
import { zeroWidthSpace } from '../constants/constants';
import TextResetSendingQueue from '../components/dialogTexts/TextResetSendingQueue';
import { store } from '../store/store';
import { toastOptions } from '../styles/styles';

export function showResetSendingQueueDialog() {
  const actions = store.getActions();

  actions.userDialog.setUserDialog({
    title: 'Reset warning!',
    message: TextResetSendingQueue,
    confirmActionText: 'Confirm reset',
    confirmActionKind: 'alert',
    width: 300,
    onConfirm: () => {
      actions.contactList.setFaxesInQueue(0);
      actions.userMessage.setMessage(zeroWidthSpace);
      actions.render.initiateForcedRender();
      const message = 'The sending queue counter has been reset!';
      toast(message, toastOptions);
      console.log(message);
    },
  });
}
