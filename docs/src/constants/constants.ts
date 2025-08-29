import { URL_WEBAPP_BASE } from '../../../webapp/frontend/src/constants/constantsImportMeta';

// Define all markdown placeholders and their replacements
export const placeholders = {
  '{{URL_WEBAPP}}': URL_WEBAPP_BASE,
} as const;

export type Placeholder = keyof typeof placeholders;
