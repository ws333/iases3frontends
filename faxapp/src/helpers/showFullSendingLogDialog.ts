import { ActionCreator } from 'easy-peasy';
import { UserDialog } from '../types/modelTypes';
import TextFullSendingLog from '../components/dialogTexts/TextFullSendingLog';

type Args = {
  setUserDialog: ActionCreator<Partial<UserDialog>>;
  fullSendingLog: string[];
};

export function showFullSendingLogDialog({ fullSendingLog, setUserDialog }: Args) {
  setUserDialog({
    title: 'Full sending log',
    message: TextFullSendingLog(fullSendingLog),
    confirmActionText: 'Close',
    showConfirmationModal: false,
    width: 800,
  });
}
