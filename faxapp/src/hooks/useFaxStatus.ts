import { useCallback, useEffect, useState } from 'react';
import { FaxStatus } from '../types/types';
import { PATH_FAX_GET_STATUS } from '../constants/constantsEndpointPaths';
import { URL_BACKEND } from '../constants/constantsImportMeta';

export function useFaxStatus(faxId: string | null) {
  const [status, setStatus] = useState<FaxStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    if (!faxId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${URL_BACKEND}${PATH_FAX_GET_STATUS.replace(':faxId', faxId)}`);
      if (response.ok) {
        const statusData: FaxStatus = await response.json();
        setStatus(statusData);
      } else if (response.status === 404) {
        // Fax not found yet, this is normal
        setStatus(null);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [faxId]);

  useEffect(() => {
    if (!faxId) return;

    void checkStatus();
  }, [faxId, checkStatus]);

  return {
    status,
    loading,
    error,
    refetch: checkStatus,
    isDelivered: status?.event_type === 'fax.delivered',
    isFailed: status?.event_type === 'fax.failed',
    failureReason: status?.payload.failure_reason,
  };
}

export function useFaxStatusAll(faxIds: string[]) {
  const [statuses, setStatuses] = useState<Record<string, FaxStatus | null>>({});
  const [loading, setLoading] = useState(false);

  const checkAllStatuses = useCallback(async () => {
    if (faxIds.length === 0) return;

    setLoading(true);
    try {
      const statusPromises = faxIds.map(async (faxId) => {
        const response = await fetch(`${URL_BACKEND}${PATH_FAX_GET_STATUS.replace(':faxId', faxId)}`);
        if (response.ok) {
          const statusData: FaxStatus = await response.json();
          return { faxId, status: statusData };
        }
        return { faxId, status: null };
      });

      const results = await Promise.all(statusPromises);
      const newStatuses: Record<string, FaxStatus> = {};

      results.forEach(({ faxId, status }) => {
        if (status) {
          newStatuses[faxId] = status;
        }
      });

      setStatuses(newStatuses);
    } catch (error) {
      console.error('Error checking fax statuses:', error);
    } finally {
      setLoading(false);
    }
  }, [faxIds]);

  useEffect(() => {
    void checkAllStatuses();
  }, [faxIds.length, checkAllStatuses]);

  return {
    statuses,
    loading,
    refetch: checkAllStatuses,
  };
}
