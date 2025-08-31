import type { JSX } from 'react';

export type Fax = {
  number: string;
  pdf: unknown;
};

export type FaxComponentProps = {
  name: string;
};

export type FileContent = number[];

export type StatusBackend = {
  status: 'OK' | 'ERROR';
  message?: string; // Message to display to user
  error?: string;
};

export type TFaxComponent = ({ name }: FaxComponentProps) => JSX.Element;
