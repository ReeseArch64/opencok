export interface MailDeletedResponse {
  readonly delete: number;
}

export interface MailSaveResponse {
  readonly save?: string;
  readonly cancel?: string;
}

export interface MailStatusResponse {
  readonly total?: bigint;
  readonly unread?: bigint;
  readonly [category: `${number}`]: { readonly total: number; readonly unread: number };
}
