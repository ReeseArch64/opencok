import type { Row } from "./rows";
import type { HeroRankSourceRow } from "./hero-rank-publication";

export interface HeroRankPeriod {
  id: string;
  type: number;
  eventId: string;
  endTime: bigint;
  group: string;
  expectedRealms: readonly number[];
}

export interface HeroRankFinalityRealm {
  candidates(now: bigint): Promise<{ events: readonly Row[]; closures: readonly Row[] }>;
  closeUnmatched(actId: string, now: bigint): Promise<void>;
  seal(period: HeroRankPeriod, now: bigint): Promise<Row | undefined>;
  page(closure: Row): Promise<readonly HeroRankSourceRow[]>;
  advance(closure: Row, cursor: string, processed: bigint): Promise<void>;
  reset(closure: Row): Promise<void>;
  completed(periodId: string): Promise<void>;
  finished(periodId: string, kingdomRank: string | null): Promise<void>;
}

export interface HeroRankFinalityRegistry {
  register(period: HeroRankPeriod, now: bigint): Promise<void>;
  get(periodId: string): Promise<HeroRankPeriod | undefined>;
  pending(kingdomId: number): Promise<readonly HeroRankPeriod[]>;
  complete(period: HeroRankPeriod, closure: Row, now: bigint): Promise<boolean>;
  finalize(period: HeroRankPeriod, now: bigint): Promise<void>;
  result(periodId: string): Promise<{ kingdomRank: string | null } | undefined>;
}
