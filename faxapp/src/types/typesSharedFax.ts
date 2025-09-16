export type FaxWebhookRequestBody = {
  data: {
    event_type:
      | 'fax.queued'
      | 'fax.media.processing.started'
      | 'fax.media.processed'
      | 'fax.sending.started'
      | 'fax.receiving.started'
      | 'fax.received'
      | 'fax.email.delivered'
      | 'fax.delivered'
      | 'fax.failed';
    id: string;
    occurred_at: string;
    record_type: string;
    payload: {
      fax_id: string;
      call_duration_secs?: number;
      connection_id?: string;
      direction?: string;
      from?: string;
      to?: string;
      original_media_url?: string;
      partial_content?: boolean;
      status?: 'queued' | 'media.processed' | 'sending.started' | 'delivered' | 'failed';
      user_id?: string;
      page_count?: number;
      failure_reason?: string;
    };
  };
  meta?: {
    attempt: number;
    delivered_to: string;
  };
};

interface StatusBackend {
  status: 'OK' | 'ERROR';
  message?: string; // Message to display to user
  error?: string;
}

export interface StatusFaxService extends StatusBackend {
  faxId?: string;
}

export type FaxHeader = {
  toName: string;
  toNumber: string;
  fromNumber?: string;
};

export type WebSocketMessage =
  | {
      type: 'set_from_number';
      apiKey: string;
    }
  | {
      type: 'send_fax';
      apiKey: string;
      faxHeader: FaxHeader;
    }
  | {
      type: 'send_fax_error';
      message: string;
    }
  | {
      type: 'send_fax_receipt';
      message: string;
    }
  | {
      type: 'send_fax_response';
      message: StatusFaxService;
    }
  | {
      type: 'fax_status_update';
      message: string;
    }
  | {
      type: 'webhook_data';
      webhookData: WebhookData;
    }
  | {
      type: 'backend_message_received';
      typeReceived: WebSocketMessage['type'];
      payload: Pick<FaxWebhookRequestBody['data'], 'event_type'> &
        Pick<FaxWebhookRequestBody['data']['payload'], 'fax_id' | 'from'>;
    };

export type WebhookData = Partial<FaxWebhookRequestBody['data']>;
