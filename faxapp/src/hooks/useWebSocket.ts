import { useCallback, useEffect, useRef } from 'react';
import { SendWebSocketMessage } from '../types/types';
import { WebSocketMessage } from '../types/typesSharedFax';
import { URL_BACKEND } from '../constants/constantsImportMeta';
import { formatFaxNumberToOriginal } from '../helpers/formatRecipientInfo';
import { updateContactState } from '../helpers/updateContactState';
import { useStoreActions } from '../store/store';

interface UseWebSocketOptions {
  apiKey: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: WebSocketMessage) => void;
}

export function useWebSocket({
  apiKey,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  onMessage,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingResolver = useRef<{ resolve: SendWebSocketMessage } | null>(null);

  const addLogItem = useStoreActions((actions) => actions.sendingLog.addLogItem);
  const decrementFaxesInQueue = useStoreActions((actions) => actions.contactList.decrementFaxesInQueue);

  const sendWebSocketMessage = useCallback((message: WebSocketMessage): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    } else {
      console.warn('WebSocket is not open. Message not sent:', message);
      return false;
    }
  }, []);

  const sendFax = useCallback(
    (message: WebSocketMessage) => {
      return new Promise<WebSocketMessage>((resolve, reject) => {
        const messageWasSent = sendWebSocketMessage(message);
        if (messageWasSent) {
          pendingResolver.current = { resolve };
        } else {
          reject(new Error('WebSocket is not open'));
        }
      });
    },
    [sendWebSocketMessage],
  );

  const connect = useCallback(() => {
    if (!apiKey) return;

    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      return console.warn('Max WebSocket reconnection attempts reached');
    }

    try {
      // Dynamically set protocol: wss for HTTPS, ws for HTTP
      const protocol = URL_BACKEND.startsWith('https://') ? 'wss://' : 'ws://';
      const wsUrl = URL_BACKEND.replace(/^https?:\/\//, protocol);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected to backend');
        reconnectAttemptsRef.current = 0;

        sendWebSocketMessage({ type: 'set_from_number', apiKey });
      };

      ws.onerror = (error) => {
        console.warn('WebSocket error:', error);
      };

      ws.onmessage = async (event: { data?: string }) => {
        if (!event.data) return console.warn('Empty websocket message received!');

        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);

          if (
            message.type === 'webhook_data' &&
            (message.webhookData.event_type === 'fax.delivered' || message.webhookData.event_type === 'fax.failed')
          ) {
            // Acknowledge that fax.delivered or fax.failed message was received so that backend can clean up state
            const answer: WebSocketMessage = {
              type: 'backend_message_received',
              typeReceived: message.type,
              payload: {
                event_type: message.webhookData.event_type,
                fax_id: message.webhookData.payload?.fax_id ?? '',
                from: message.webhookData.payload?.from,
              },
            };
            sendWebSocketMessage(answer);

            // Update faxesQueued
            decrementFaxesInQueue();

            /**
             * Update state when a fax has been delivered
             */
            const toNumber = formatFaxNumberToOriginal(message.webhookData.payload?.to ?? '');

            const failureReason =
              message.webhookData.event_type === 'fax.failed'
                ? (message.webhookData.payload?.failure_reason ?? 'failure_reason was undefined')
                : null;

            if (failureReason) console.warn(message);

            if (toNumber) {
              await updateContactState(toNumber, failureReason);
            } else {
              console.warn(`${useWebSocket.name} -> formatFaxNumberToOriginal -> toNumber is undefined`);
            }

            addLogItem({
              message: `Fax to ${message.webhookData.payload?.to} ${message.webhookData.event_type.slice(4)}!`,
            });
          }

          // Resolve pending promise in sendWebSocketMessageAsync
          if (message.type === 'send_fax_receipt' || message.type === 'send_fax_error') {
            if (pendingResolver.current) {
              pendingResolver.current.resolve(message);
              pendingResolver.current = null;
            }
          }
        } catch (error) {
          console.warn('Failed to parse WebSocket message:', (error as Error).message);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);
        if (!event.wasClean && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', (error as Error).message);
      // Optionally, trigger a retry or notify the user
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
      }
    }
  }, [
    addLogItem,
    apiKey,
    decrementFaxesInQueue,
    maxReconnectAttempts,
    onMessage,
    reconnectInterval,
    sendWebSocketMessage,
  ]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { sendWebSocketMessage, sendFax, disconnect };
}
