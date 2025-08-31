import { CSSProperties } from 'react';

export const spinnerHeight = 42;

export const outerDivStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
};

export const divContainerButtons: CSSProperties = {
  maxHeight: '30vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
};

// Reserve space for the spinner so that the header does not move when spinner appears/disappears
export const spinnerContainerStyles: CSSProperties = {
  height: spinnerHeight,
};
