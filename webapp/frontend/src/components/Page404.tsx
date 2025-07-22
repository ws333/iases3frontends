import { CSSProperties } from 'react';
import './Page404.css';

const styles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
};

function Page404() {
  return (
    <div style={styles} className="hovering_404">
      <h2>404 - You are floating peacefully in empty space</h2>
    </div>
  );
}

export default Page404;
