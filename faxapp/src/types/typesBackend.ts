import { Request } from 'express';
import { Fax } from './types';

export interface SendFaxRequestBody extends Request {
  fax: Fax;
}

export interface SendFaxResponseBody {
  message?: string;
  error?: string;
}
