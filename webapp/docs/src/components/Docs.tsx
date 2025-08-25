import { Link } from 'react-router-dom';
import HeaderWithIFO from './HeaderWithIFO';
import Introduction from './Introduction';

function Docs() {
  return (
    <div className="docs-outer-div">
      <HeaderWithIFO showIFOWhenMounted />
      <Introduction />

      <ul>
        <li>
          <Link to="/documentation">Documentation</Link>
        </li>
        <li>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </li>
        <li>
          <Link to="/terms-of-service">Terms of Service</Link>
        </li>
      </ul>
    </div>
  );
}

export default Docs;
