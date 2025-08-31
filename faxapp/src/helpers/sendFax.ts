import { Fax, StatusBackend } from '../types/types';

export async function sendFax(fax: Fax) {
  console.log('Sending fax:', fax.number);
  const status: StatusBackend = { status: 'OK', message: 'Sending of faxes not yet implemented' };
  return Promise.resolve(status);
}
