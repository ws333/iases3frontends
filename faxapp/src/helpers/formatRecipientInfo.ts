import { store } from '../store/store';
import { getCountryCallingCode } from './getCountryCallingCode';

/**
 * - Add country calling code and convert number to E.164 format (remove any non-digit characters)
 */
export function formatFaxNumber(faxNumber: string) {
  const { countryCode } = store.getState().faxOptions;
  const callingCode = getCountryCallingCode(countryCode);

  return `+${callingCode}${faxNumber.replace(/\D/g, '')}`;
}

export function formatName(name: string) {
  const { countryCode } = store.getState().faxOptions;
  const title = countryCode === 'US' ? 'Dear' : '';

  return `${title} ${name}`;
}

export function formatFaxNumberToOriginal(faxNumber: string) {
  const { countryCode } = store.getState().faxOptions;
  const callingCode = getCountryCallingCode(countryCode);
  if (!callingCode) return 'callingCode not defined';
  const offset = callingCode.length + 1;
  return `${faxNumber.slice(offset, offset + 3)}-${faxNumber.slice(offset + 3, offset + 6)}-${faxNumber.slice(offset + 6)}`;
}
