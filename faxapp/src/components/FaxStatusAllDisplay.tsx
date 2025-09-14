import { JSX } from 'react';
import { useFaxStatusAll } from '../hooks/useFaxStatus';
import { objectEntries } from '../../../addon/packages/interface/src/helpers/objectHelpers';

interface Props {
  faxIds: string[];
}

export function FaxStatusAllDisplay({ faxIds }: Props) {
  const { statuses, loading } = useFaxStatusAll(faxIds);

  if (!faxIds.length) return <div>ℹ️ No Fax IDs are available yet</div>;
  if (loading) return <div>⏳ Checking fax status...</div>;

  return objectEntries(statuses).map(([faxId, status]) => {
    const to = status?.payload.to;
    const faxTo = `Fax to ${to} `;

    if (!status) return <div key={faxId}>📄 {faxTo} queued, waiting for status...</div>;

    const duration = status.payload.call_duration_secs;

    // Other statuses
    const statusMessages: Record<string, JSX.Element> = {
      'fax.queued': <span>📋 {faxTo} queued for sending</span>,
      'fax.delivered': (
        <span>
          ✅ {faxTo} delivered successfully {typeof duration === 'number' ? `in ${duration} secs` : ''}
        </span>
      ),
      'fax.media.processed': <span>📄 {faxTo} PDF processed, ready faxTo send</span>,
      'fax.sending.started': <span>📤 {to} is being sent...</span>,
      'fax.failed': (
        <span>
          ❌ {faxTo} failed: {status.payload.failure_reason ?? 'Unknown error'}
        </span>
      ),
    };

    return <div key={faxId}>{statusMessages[status.event_type]}</div>;
  });
}
