import { FaxStatuses } from '../types/types';

interface Props {
  statuses: FaxStatuses;
}

function FaxStatusList({ statuses }: Props) {
  return (
    <div className="fax-status-list">
      <h3>Sending status</h3>
      <ul>
        {Array.from(statuses.entries()).map(([faxId, status]) => (
          <li key={faxId}>{status.value}</li>
        ))}
      </ul>
    </div>
  );
}

export default FaxStatusList;
