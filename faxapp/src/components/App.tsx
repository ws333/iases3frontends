import { maxFaxesInQueueCount } from '../constants/constants';
import { useStoreState } from '../store/store';
import FaxSender from './FaxSender';
import IconIFO from './IconIFO';
import SettingsMenu from './SettingsMenu';
import './App.css';

export default function App() {
  const faxesInQueue = useStoreState((state) => state.contactList.faxesInQueue);

  return (
    <div className="scrollable">
      <header className="header">
        <div className="IFO-and-settings">
          <IconIFO isHovering={false} />
          <div className="header-section-align-right">
            <div className="header-section-counter">
              Sending queue counter: {faxesInQueue} (max {maxFaxesInQueueCount})
            </div>
            <SettingsMenu />
          </div>
        </div>
      </header>
      <FaxSender />
    </div>
  );
}
