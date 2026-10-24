export class MailDeletedDto {
  declare public readonly delete: number;
}

export class MailSaveDto {
  declare public readonly save?: string;
  declare public readonly cancel?: string;
}

export class MailStatusDto {
  declare public readonly total?: bigint;
  declare public readonly unread?: bigint;
  readonly [category: `${number}`]: { readonly total: number; readonly unread: number };
}
