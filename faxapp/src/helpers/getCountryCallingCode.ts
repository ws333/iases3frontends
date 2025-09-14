import countryCodes from '../constants/countryCodes';

export function getCountryCallingCode(countryCode: string) {
  return countryCodes.find((item) => item.countryCode === countryCode)?.countryCallingCode;
}
