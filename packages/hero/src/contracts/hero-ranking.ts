import type { Row } from "@opencok/contracts/rows";

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

export interface HeroInsideRankingSnapshot {
  profile: Row | undefined;
  rows: readonly Row[];
}

export interface HeroHistorySnapshot {
  profile: Row | undefined;
  active: Row | undefined;
  events: readonly Row[];
  castleLevel: number;
  alliancePower: bigint;
}

export interface HeroHistoryPublication {
  members: readonly string[];
  alliances: readonly (string | null)[];
}
