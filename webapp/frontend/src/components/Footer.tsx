import { DOCS_URL } from '../constants/constantsImportMeta';
import './Footer.css';

const Footer = () => {
  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="footer">
      <a
        href="#"
        className="footer-link"
        onClick={(e) => {
          e.preventDefault();
          openInNewTab(`${DOCS_URL}documentation`);
        }}
      >
        Documentation
      </a>
      <a
        href="#"
        className="footer-link"
        onClick={(e) => {
          e.preventDefault();
          openInNewTab(`${DOCS_URL}privacy-policy`);
        }}
      >
        Privacy Policy
      </a>
      <a
        href="#"
        className="footer-link"
        onClick={(e) => {
          e.preventDefault();
          openInNewTab(`${DOCS_URL}terms-of-service`);
        }}
      >
        Terms of Service
      </a>
    </footer>
  );
};

export default Footer;
