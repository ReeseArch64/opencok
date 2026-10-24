import type { Row } from "./rows.ts";

export interface HeroRankingSnapshot {
  profile: Row | undefined;
  events: readonly Row[];
}
export interface HeroRankingLookup {
  keys: readonly string[];
  member: string;
}
export interface HeroSelfRanking {
  ranking: number;
  rankingAlliance: number;
  type: number;
}
