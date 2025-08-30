import { URL_WEBAPP_BASE } from '../../../webapp/src/constants/constantsImportMeta';

export type Placeholder = keyof typeof placeholders;

export const IASE_URL = 'https://www.bashar.org/socialexperiment';

// Define all markdown placeholders and their replacements
export const placeholders = {
  '{{URL_WEBAPP}}': URL_WEBAPP_BASE,
} as const;
