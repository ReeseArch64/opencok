export class MailDeletedDto {
  readonly delete!: number;
}

export class MailSaveDto {
  readonly save?: string;
  readonly cancel?: string;
}

export class MailStatusDto {
  readonly total?: bigint;
  readonly unread?: bigint;
  readonly [category: `${number}`]: { readonly total: number; readonly unread: number };
}
