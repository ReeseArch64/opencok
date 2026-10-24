import type { Row } from "./rows.ts";

export type PlayerRankingKind = "power" | "kills" | "level" | "building";

export interface PlayerRankingQuery {
  kind: PlayerRankingKind;
  limit: number;
  hideGm: boolean;
  now: number;
}

export interface PlayerRankingSnapshot {
  profile: Row | undefined;
  candidates: readonly Row[];
  fallbackRank: bigint;
}

export interface PlayerRankingResult {
  rows: readonly Row[];
  selfRanking: number;
}
