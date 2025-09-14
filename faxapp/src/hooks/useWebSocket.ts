import { useCallback, useEffect, useRef } from 'react';
import { WebSocketMessage } from '../types/typesSharedFax';
import { URL_BACKEND } from '../constants/constantsImportMeta';
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

  const addLogItem = useStoreActions((state) => state.sendingLog.addLogItem);

  const sendWebSocketMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open. Message not sent:', message);
    }
  }, []);

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

      ws.onopen = () => {
        console.log('WebSocket connected to backend');
        reconnectAttemptsRef.current = 0;

        const message: WebSocketMessage = {
          type: 'set_from_number',
          apiKey,
        };
        ws.send(JSON.stringify(message));
      };

      ws.onerror = (error) => {
        console.warn('WebSocket error:', error);
      };

      ws.onmessage = (event: { data?: string }) => {
        if (!event.data) return console.warn('Empty websocket message received!');

        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
          console.log(message);

          // Acknowledge that fax.delivered or fax.failed message was received so that backend can clean up state
          if (
            message.type === 'webhook_data' &&
            (message.webhookData.event_type === 'fax.delivered' || message.webhookData.event_type === 'fax.failed')
          ) {
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

            addLogItem({
              message: `Fax to ${message.webhookData.payload?.to} ${message.webhookData.event_type.slice(4)}!`,
            });
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

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', (error as Error).message);
      // Optionally, trigger a retry or notify the user
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
      }
    }
  }, [addLogItem, apiKey, maxReconnectAttempts, onMessage, reconnectInterval, sendWebSocketMessage]);

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

  return { sendWebSocketMessage, disconnect };
}
