import type { Row } from "./rows";

export interface PrayerState {
  record?: Row;
}

export interface PrayerWrite {
  record: Row;
  history?: { cost: number; resource: string; amount: number; hit: number; at: bigint };
}
