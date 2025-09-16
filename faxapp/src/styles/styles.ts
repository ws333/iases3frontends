import { CSSProperties } from 'react';
import { ToastOptions } from 'react-toastify';

export const toastStyles: CSSProperties = {
  backgroundColor: '#222',
  opacity: 1,
  whiteSpace: 'pre-line', // Preserve newlines
  width: 'auto',
  minWidth: '200px',
  maxWidth: '800px',
  paddingRight: '4rem',
};

export const toastOptions: ToastOptions = {
  autoClose: 5000,
  position: 'top-center',
  style: toastStyles,
  theme: 'dark',
  type: 'success',
} as const;
