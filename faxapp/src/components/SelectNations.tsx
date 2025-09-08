import { ContactI3CFax } from '../types/typesI3C';
import { splitIntoVerticalColumns } from '../helpers/splitIntoVerticalColumns';
import { useStoreActions, useStoreState } from '../store/store';
import { SentCounts } from './SentCounts';
import './SelectNations.css';

type Props = {
  selectedContactsNotSent: ContactI3CFax[];
  isSending: boolean;
};

function SelectNations({ selectedContactsNotSent, isSending }: Props) {
  const nationOptions = useStoreState((state) => state.contactList.nationOptions);
  const selectedContacts = useStoreState((state) => state.contactList.selectedContacts);
  const selectedNations = useStoreState((state) => state.contactList.selectedNations);
  const setSelectedNation = useStoreActions((actions) => actions.contactList.setSelectedNation);
  const toggleIsSelectedAllNations = useStoreActions((actions) => actions.contactList.toggleIsSelectedAllNations);
  const isSelectedAllNations = useStoreState((state) => state.contactList.isSelectedAllNations);

  const onChangeSelectAll = () => {
    toggleIsSelectedAllNations();
  };

  const onChangeNation = (checked: boolean, nation: string) => {
    setSelectedNation({ checked, nation });
  };

  const columns = 4;
  const nationColumns = splitIntoVerticalColumns(nationOptions, columns);

  return (
    <div className="select-nations">
      <div>
        <label className="select-nations-label">Available contacts</label>
        <div className={`nation-list ${isSending ? 'disabled' : ''}`}>
          <label className="nation-item">
            <input type="checkbox" disabled={isSending} checked={isSelectedAllNations} onChange={onChangeSelectAll} />
            Select All
          </label>
        </div>
        <div className={`nation-list-columns ${isSending ? 'disabled' : ''}`}>
          {nationColumns.map((col, colIdx) => (
            <div key={colIdx} className="nation-list-column">
              {col.map((nation) => (
                <label key={nation} className="nation-item">
                  <input
                    type="checkbox"
                    disabled={isSending}
                    onChange={(e) => onChangeNation(e.target.checked, nation)}
                    checked={selectedNations.includes(nation)}
                  />
                  {nation}
                </label>
              ))}
            </div>
          ))}
          {!nationOptions.length && (
            <div className="nation-list-empty">
              <p>No contacts are yet available for the country you are currently connected to</p>
              <p>If using a VPN service connect to a server in the appropriate country</p>
            </div>
          )}
        </div>
        <div className="selected-info">
          <div>
            <div>Selected contacts</div>
            <div>Not sent to last 3 months</div>
          </div>
          <div>
            <div>{selectedContacts.length}</div>
            <div>{selectedContactsNotSent.length}</div>
          </div>
        </div>
        <SentCounts />
      </div>
    </div>
  );
}

export default SelectNations;
