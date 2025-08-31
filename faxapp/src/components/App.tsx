import FaxSender from './FaxSender';
import IconIFO from './IconIFO';
import SettingsMenu from './SettingsMenu';
import './App.css';

export default function App() {
  return (
    <div className="scrollable">
      <header className="header">
        <div className="IFO-and-settings">
          <IconIFO isHovering={false} />
          <div className="header-section-align-right">
            <SettingsMenu />
          </div>
        </div>
      </header>
      <FaxSender />
    </div>
  );
}
