import { sessionFinishedText } from '../constants/constants';

export const getSessionFinishedText = (faxesSent: number) =>
  `${sessionFinishedText} ${faxesSent.toString()} faxes were sent.`;
