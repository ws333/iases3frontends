import { sessionFinishedText } from '../constants/constants';

export const getSessionFinishedText = (faxesSent: number) =>
  `${sessionFinishedText} ${faxesSent.toString()} fax${faxesSent !== 1 ? `es` : ``} done!`;
