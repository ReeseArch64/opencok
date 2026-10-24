export interface NicknameItemDeleteResponse {
  readonly uuid: string;
  readonly itemId: string;
  readonly count: number;
}
export interface NicknameItemAddResponse {
  readonly uuid: string;
  readonly itemId: string;
  readonly count: number;
  readonly vanishTime: bigint;
  readonly para1?: string;
  readonly para2?: string;
  readonly para3?: string;
  readonly para4?: string;
  readonly para5?: string;
  readonly para6?: string;
  readonly para7?: string;
  readonly para8?: string;
  readonly para9?: string;
}
export interface NicknameMobileGoldResponse {
  readonly freeGold: bigint;
  readonly paidGold: bigint;
  readonly paidSpecialGold: bigint;
}
export interface NicknameDmmGoldResponse {
  readonly dmmGold: bigint;
  readonly dmmPaidGold: bigint;
  readonly dmmPaidSpecialGold: bigint;
}
export interface NicknameChangeReplyResponse {
  readonly gold?: bigint;
  readonly status: boolean;
}
