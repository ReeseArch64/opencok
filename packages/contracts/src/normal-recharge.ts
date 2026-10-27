import type { Row } from "./rows";

export interface NormalRechargeState {
  server: Row;
  totals: readonly Row[];
  payment(orderId: string, platform: string): Promise<Row | undefined>;
  processed(key: string): Promise<string | undefined>;
}

export interface NormalRechargeWrite {
  mergeBegin?: bigint;
  total?: { type: number; gold: bigint; getLv: number; updateTime: bigint };
  receipt?: { key: string; fingerprint: string };
}

export interface NormalRechargePeriod {
  type: number;
  start: bigint;
  end: bigint;
}
