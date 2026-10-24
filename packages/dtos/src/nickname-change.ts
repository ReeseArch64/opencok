export class NicknameItemDeleteDto {
  declare public readonly uuid: string;
  declare public readonly itemId: string;
  declare public readonly count: number;
}
export class NicknameItemAddDto {
  declare public readonly uuid: string;
  declare public readonly itemId: string;
  declare public readonly count: number;
  declare public readonly vanishTime: bigint;
  declare public readonly para1?: string;
  declare public readonly para2?: string;
  declare public readonly para3?: string;
  declare public readonly para4?: string;
  declare public readonly para5?: string;
  declare public readonly para6?: string;
  declare public readonly para7?: string;
  declare public readonly para8?: string;
  declare public readonly para9?: string;
}
export class NicknameMobileGoldDto {
  declare public readonly freeGold: bigint;
  declare public readonly paidGold: bigint;
  declare public readonly paidSpecialGold: bigint;
}
export class NicknameDmmGoldDto {
  declare public readonly dmmGold: bigint;
  declare public readonly dmmPaidGold: bigint;
  declare public readonly dmmPaidSpecialGold: bigint;
}
export class NicknameChangeReplyDto {
  declare public readonly gold?: bigint;
  declare public readonly status: boolean;
}
