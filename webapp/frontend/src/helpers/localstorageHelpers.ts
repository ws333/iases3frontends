import { LastClickedLoginButton, LoginDebounceMeasurements } from '../types/types';

/**
 * Persist state to allow automatic login to last chosen login provider if already authenticated
 */

const lastLoginButtonKey = 'lastLoginButtonClicked';

export function getLastLoginButtonClicked() {
  return localStorage.getItem(lastLoginButtonKey) as LastClickedLoginButton;
}

export function setLastLoginButtonClicked(provider: LastClickedLoginButton) {
  localStorage.setItem(lastLoginButtonKey, provider);
}

export function removeLastLoginButtonClicked() {
  localStorage.removeItem(lastLoginButtonKey);
}

/**
 * Persist and retrieve login debounce measurements for cross-session statistics
 */

const loginDebounceMeasurementsKey = 'loginDebounceMeasurements';

export function getLoginDebounceMeasurements(maxMeasurements: number): LoginDebounceMeasurements {
  const stored = localStorage.getItem(loginDebounceMeasurementsKey);
  if (stored) {
    const arr = JSON.parse(stored);
    if (Array.isArray(arr) && arr.every((n) => typeof n === 'number')) {
      return arr.slice(-maxMeasurements);
    }
  }
  return [];
}

export function setLoginDebounceMeasurements(arr: LoginDebounceMeasurements) {
  localStorage.setItem(loginDebounceMeasurementsKey, JSON.stringify(arr));
}
