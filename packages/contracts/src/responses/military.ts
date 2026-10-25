export interface WoundedTroopsResponse {
  readonly id: string;
  readonly dead: number;
  readonly heal?: number;
  readonly finish?: bigint;
}
export interface FortificationResponse {
  readonly id: string;
  readonly free: number;
  readonly level: number;
  readonly train?: number;
  readonly finish?: bigint;
  readonly attack: number;
  readonly defen: number;
  readonly range?: number;
  readonly move?: number;
  readonly wood?: number;
  readonly stone: number;
  readonly iron: number;
  readonly food: number;
  readonly time: number;
  readonly power: number;
  readonly load?: number;
}
