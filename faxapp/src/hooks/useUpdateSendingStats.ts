import { useEffect, useState } from 'react';

/**
 * - Used to update sending stats regularly also when not sending,
 *   i.e. make "Last hour" etc stay current.
 */
export function useUpdateSendingStats(isSending: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUpdateStatsRender] = useState(1);
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSending) {
        setUpdateStatsRender((prev) => prev + 1);
      }
    }, 1000 * 60);
    return () => {
      clearInterval(timer);
    };
  }, [isSending]);
}
