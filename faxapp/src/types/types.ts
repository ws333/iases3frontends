import type { JSX } from 'react';
import { FaxWebhookRequestBody, WebSocketMessage } from './typesSharedFax';

export type FaxComponentProps = {
  name: string;
};

export interface FaxStatus {
  event_type: FaxWebhookRequestBody['data']['event_type'];
  payload: FaxWebhookRequestBody['data']['payload'];
  received_at: string;
}

export type TFaxComponent = ({ name }: FaxComponentProps) => JSX.Element;

export type FaxStatuses = Map<string, { timestamp: number; value: string }>;

export type SendWebSocketMessage = (message: WebSocketMessage) => void;
