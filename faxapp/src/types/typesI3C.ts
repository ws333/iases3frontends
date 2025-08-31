// Modified version of type ContactI3CFax from IASES3 extractor project
export type ContactI3CFax = {
  uid: number; // Artificial Unix timestamp in milliseconds
  na: string; // Contact's nation, not exported
  i: string; // Contact's institution (or house if specified), not exported
  s: string; // Contact's subgroup, not exported
  n: string; // Contact's name, not exported
  f: string; // Contact's fax number, not exported
  ud: string; // Backend-managed timestamp of last update, not modified here
  cb1: string; // Backend-specific custom field, not exported
  cb2: string; // Backend-specific custom field, not exported
  sd: number; // Unix timestamp of the last fax sent
  sc: number; // Total number of faxes sent
  dd: number; // 0 for active contacts, timestamp when moved to deleted file
  cf1: string; // Frontend-specific custom field, included in export
  cf2: string; // Frontend-specific custom field, included in export
};

export type Contact = Pick<ContactI3CFax, 'n' | 'f'>;

export interface ImportData {
  contacts: {
    active: Pick<ContactI3CFax, 'uid' | 'sd' | 'sc' | 'cf1' | 'cf2'>[];
    deleted: Pick<ContactI3CFax, 'uid' | 'sd' | 'sc' | 'dd' | 'cf1' | 'cf2'>[];
  };
  metadata: [
    {
      key: 'exportDate';
      value: number; // Timestamp when this export was created
    },
    {
      key: 'lastImportExportDate';
      value: number; // Last import/export date from the exported state, for validation
    },
  ];
}

export type ImportStats = { contactsDeleted: number; contactsProcessed: number; logsProcessed: number };

export type AddLogItemOptions = {
  addNewline?: boolean;
};

export type SendingLogEntry = {
  timestamp: number;
  message: string;
};

export type SessionState = {
  faxesSent: number;
  timestamp: number;
};
