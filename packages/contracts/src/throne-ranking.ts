import type { Row } from "./rows.ts";

export interface ThroneRankingPeriod {
  index: number;
  info: string;
}

export interface ThroneRankingSnapshot {
  period: ThroneRankingPeriod | undefined;
  rows: readonly Row[];
}
