import { SendingLogEntry, SessionState } from '../types/typesI3C';
import { sessionStateKey, zeroWidthSpace } from '../../../addon/packages/interface/src//constants/constants';
import { getSessionFinishedText } from './getSessionFinishedText';
import { storeSendingLog } from './indexedDB';
import { updateSendingLogState } from './updateSendingLogState';

/**
 * - The session state is used to update the log if a user close the window during a session
 * - The delay is to make sure the timestamp is later than the async logging in logSendingMessage
 *   happening just before updateSessionState is called
 */
export function updateSessionState(faxesSent: number, delay: number) {
  storeSessionState({ faxesSent, timestamp: Date.now() + delay * 1000 });
}

export function clearSessionState() {
  localStorage.removeItem(sessionStateKey);
}

export function getSessionState() {
  const storedState = localStorage.getItem(sessionStateKey);
  return storedState ? (JSON.parse(storedState) as SessionState) : undefined;
}

export function storeSessionState(value: SessionState) {
  const valueString = JSON.stringify(value);
  localStorage.setItem(sessionStateKey, valueString);
}

export async function checkForDangelingSession() {
  const sessionState = getSessionState();
  if (sessionState && sessionState.faxesSent > 0) {
    const message = getSessionFinishedText(sessionState.faxesSent);
    const { timestamp } = sessionState;
    const storeValue: SendingLogEntry[] = [
      // The timestamps are used for sorting the items in the sending log
      // zeroWidthSpace needs a timestamp after message
      { message, timestamp },
      { message: zeroWidthSpace, timestamp: timestamp + 1 },
    ];
    await storeSendingLog(storeValue);
    await updateSendingLogState();
    clearSessionState();
  }
}
