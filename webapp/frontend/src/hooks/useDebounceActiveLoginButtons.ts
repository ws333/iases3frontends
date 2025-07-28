import { useEffect, useRef, useState } from 'react';
import { IsActiveGoogleLogin, LoginDebounceMeasurements } from '../types/types';
import { getLoginDebounceMeasurements, setLoginDebounceMeasurements } from '../helpers/localstorageHelpers';

type ShowButtons = 'both' | 'google' | 'ms' | 'none';

const maxMeasurements = 100;
const defaultDebounceTime = 500;
const debounceTimeSafetyWindow = 50;

interface Props {
  isActiveGoogleLogin: IsActiveGoogleLogin;
  isActiveMSLogin: boolean;
}

export function useDebounceActiveLoginButtons({ isActiveGoogleLogin, isActiveMSLogin }: Props) {
  // Debounce and measurement logic
  const [showButtons, setShowButtons] = useState<ShowButtons>('none');
  const [debounceTime, setDebounceTime] = useState(defaultDebounceTime);
  const mountTimeRef = useRef<number>(Date.now());
  const measurementsRef = useRef<LoginDebounceMeasurements>([]);

  const maxDebounceTime = 1000;

  useEffect(() => {
    measurementsRef.current = getLoginDebounceMeasurements(maxMeasurements);
  }, []);

  // Google login check is the slowest so only measure the time and update rolling window if active google login
  useEffect(() => {
    if (isActiveGoogleLogin.status) {
      const now = Date.now();
      const elapsed = Math.min(maxDebounceTime, now - mountTimeRef.current);

      // Add to rolling window
      measurementsRef.current.push(elapsed);
      if (measurementsRef.current.length > maxMeasurements) {
        measurementsRef.current.shift();
      }

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
  }, [isActiveMSLogin, isActiveGoogleLogin.status]);

  // Debounce display: only show buttons after debounceTime has passed
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const now = Date.now();
    const elapsed = now - mountTimeRef.current;
    if (elapsed < debounceTime) {
      timeout = setTimeout(() => {
        if (isActiveMSLogin && isActiveGoogleLogin.status) {
          setShowButtons('both');
        } else if (isActiveMSLogin) {
          setShowButtons('ms');
        } else if (isActiveGoogleLogin.status) {
          setShowButtons('google');
        } else {
          setShowButtons('none');
        }
      }, debounceTime - elapsed);
    }

    return () => clearTimeout(timeout);
  }, [isActiveMSLogin, isActiveGoogleLogin.status, debounceTime]);

  return { showButtons };
}
