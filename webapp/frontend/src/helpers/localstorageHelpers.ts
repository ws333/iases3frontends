import { LastLoginButtonValue, LoginGoogleInProgress } from '../types/types';

/**
 * Persist state to allow automatic login to last chosen login provider if already authenticated
 */

const lastLoginButtonKey = 'lastLoginButtonClicked';

export function getLastLoginButtonClicked() {
  return localStorage.getItem(lastLoginButtonKey) as LastLoginButtonValue;
}

export function setLastLoginButtonClicked(provider: LastLoginButtonValue) {
  localStorage.setItem(lastLoginButtonKey, provider);
}

export function removeLastLoginButtonClicked() {
  localStorage.removeItem(lastLoginButtonKey);
}

/**
 * Persist state to handle both authentication after login redirects
 * and verification of authentication when already logged in
 * Values can be "true" or "cleanedup" if set. The latter means that a dangeling "true" after
 * an aborted login has been cleaned up, which will affect behaviour in the ProtectedRoute component.
 *
 */

const loginGoogleInProgressKey = 'loginGoogleInProgress';

export function getLoginGoogleInProgress() {
  return localStorage.getItem(loginGoogleInProgressKey) as LoginGoogleInProgress;
}
export function setLoginGoogleInProgress(value: LoginGoogleInProgress) {
  localStorage.setItem(loginGoogleInProgressKey, value);
}

export function removeLoginGoogleInProgress() {
  localStorage.removeItem(loginGoogleInProgressKey);
}
