import type { JSX } from 'react';

export type FaxComponentProps = {
  name: string;
};

export type TFaxComponent = ({ name }: FaxComponentProps) => JSX.Element;

export type FaxStatuses = Map<string, { timestamp: number; value: string }>;
