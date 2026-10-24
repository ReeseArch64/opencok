import type { Row } from "./rows.ts";

export type AllianceRankingKind = "power" | "kills";

export interface AllianceRankingQuery {
  kind: AllianceRankingKind;
  limit: number;
  now: number;
}

export interface AllianceRankingSnapshot {
  profile: Row | undefined;
  candidates: readonly Row[];
  sciences: readonly Row[];
  videos: readonly Row[];
  fallbackRank: bigint;
}

export interface AllianceRankingResult {
  rows: { alliance: Row; maxMember: number; video: Row | undefined }[];
  selfRanking: number;
}
