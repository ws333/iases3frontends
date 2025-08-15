import { CSSProperties } from 'react';

export const outerDivStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
};

const common: CSSProperties = {
  gap: '1rem',
  padding: '1rem',
  justifyContent: 'center',
};

export const divContainerButtons: CSSProperties = {
  maxHeight: '30vh',
  marginTop: '1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
};

export const divButtonsRowStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  ...common,
};

export const displayFlexRow: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
};

export const divButtonsColumnStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  ...common,
};

export const buttonDocumentationStyles: CSSProperties = {
  marginTop: '2rem',
  marginBottom: '4rem',
};

const buttonAuthCommon: CSSProperties = {
  height: 40,
  cursor: 'pointer',
};

// Google buttons use a image for background
export const buttonGoogleStyles: CSSProperties = {
  ...buttonAuthCommon,
  padding: 0,
  border: 'none',
  background: 'none',
};

// Styles to match Google buttons since MS buttons use icon and text
export const buttonMSStyles: CSSProperties = {
  ...buttonAuthCommon,
  padding: 10,
  borderRadius: '4px',
  border: 'solid 1px #8d918f',
  backgroundColor: '#141414',
  gap: 11,
};

export const buttonSpanMSStyles: CSSProperties = {
  fontFamily: 'Roboto, Arial, sans-serif',
  fontWeight: 500,
  fontSize: 13,
};

export const buttonLogoMSStyles: CSSProperties = {
  height: 20,
};

export const outerDivActiveLoginButtonsStyles: CSSProperties = {
  marginTop: '2rem',
};

export const activeUserEmailStyles: CSSProperties = {
  zIndex: -1,
  position: 'absolute',
  border: 'none',
  color: 'seagreen',
};
