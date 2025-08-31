import { logsToDisplaySize, zeroWidthSpace } from '../constants/constants';
import { getDateTime } from './getDateTime';
import { getSendingLog } from './indexedDB';

export async function getLogsToDisplay() {
  const storedLog = await readSendingLog();
  const logsToDisplay = storedLog.reverse().slice(0, logsToDisplaySize);

  // Remove last session if not all logs are included
  while (logsToDisplay.length && logsToDisplay[logsToDisplay.length - 1] !== zeroWidthSpace) {
    logsToDisplay.pop();
  }

  // Remove last zeroWidthSpace
  logsToDisplay.pop();

  return logsToDisplay;
}

export async function readSendingLog() {
  const log = await getSendingLog();

  const formattedLog = log.map((log) => {
    const message = log.message === zeroWidthSpace ? log.message : `${getDateTime(log.timestamp)} - ${log.message}`;
    return message;
  }, []);

  return formattedLog;
}
