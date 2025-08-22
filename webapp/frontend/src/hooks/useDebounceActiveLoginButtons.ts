import { useEffect, useRef, useState } from 'react';
import { IsActiveGoogleLogin, LoginDebounceMeasurements, ShowActiveLoginButtons } from '../types/types';
import { getLoginDebounceMeasurements, setLoginDebounceMeasurements } from '../helpers/localstorageHelpers';

const maxMeasurements = 30;
const maxDebounceTime = 1000;
const defaultDebounceTime = 500;
const debounceTimeSafetyWindow = 50;

type Props = {
  isActiveGoogleLogin: IsActiveGoogleLogin;
  isActiveMSLogin: boolean;
};

export function useDebounceActiveLoginButtons({ isActiveGoogleLogin, isActiveMSLogin }: Props) {
  const [showActiveLoginButtons, setShowActiveLoginButtons] = useState<ShowActiveLoginButtons>('none');
  const [debounceTime, setDebounceTime] = useState(defaultDebounceTime);
  const mountTimeRef = useRef<number>(Date.now());
  const measurementsRef = useRef<LoginDebounceMeasurements>([]);

  useEffect(() => {
    measurementsRef.current = getLoginDebounceMeasurements(maxMeasurements);
  }, []);

  // Google login check is the slowest so only measure the time and update rolling window if active google login
  useEffect(() => {
    if (isActiveGoogleLogin.valid) {
      const timeElapsed = Math.min(maxDebounceTime, Date.now() - mountTimeRef.current);

      // Add to rolling window
      measurementsRef.current.push(timeElapsed);
      if (measurementsRef.current.length > maxMeasurements) measurementsRef.current.shift();

      // Persist to localStorage
      setLoginDebounceMeasurements(measurementsRef.current);

      // Calculate 99th percentile
      const sorted = [...measurementsRef.current].sort((a, b) => a - b);
      const idx = Math.floor(sorted.length * 0.99) - 1;
      if (sorted.length > 0) {
        const percentile99 = sorted[Math.max(0, idx)] + debounceTimeSafetyWindow;
        setDebounceTime(percentile99);
      }
    }
  }, [isActiveMSLogin, isActiveGoogleLogin.valid]);

  // Only show buttons after debounceTime has passed
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const now = Date.now();
    const elapsed = now - mountTimeRef.current;
    if (elapsed < debounceTime) {
      timeout = setTimeout(() => {
        if (isActiveMSLogin && isActiveGoogleLogin.valid) {
          setShowActiveLoginButtons('both');
        } else if (isActiveMSLogin) {
          setShowActiveLoginButtons('ms');
        } else if (isActiveGoogleLogin.valid) {
          setShowActiveLoginButtons('google');
        } else {
          setShowActiveLoginButtons('none');
        }
      }, debounceTime - elapsed);
    }

    return () => clearTimeout(timeout);
  }, [isActiveMSLogin, isActiveGoogleLogin.valid, debounceTime]);

  return { showActiveLoginButtons };
}
