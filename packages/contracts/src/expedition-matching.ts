import type { Row } from "./rows";
export interface ExpeditionMatchStats {
  topAlliancePower: number;
  topUserPower: string;
  over30: number;
  over26: number;
  over10M: number;
  r5: number;
  victories: number;
  failures: number;
}
export interface ExpeditionMatchRealm {
  kingdomId: number;
  stats: ExpeditionMatchStats;
  previousMatch: number;
}
export interface ExpeditionMatchConfiguration {
  powerClose: number;
  powerFar: number;
  over30: number;
  over26: number;
  over10M: number;
  distance: number;
  window: number;
  choices: number;
  victories: number;
  failures: number;
  weights: readonly number[];
}
export interface ExpeditionMatchResult {
  kingdomId: number;
  opponent: number;
  matchedAt: bigint;
}
export interface ExpeditionMatchingRealmStore {
  admit(period: Row, allowNew?: boolean): Promise<Row | undefined>;
  apply(period: Row, result: ExpeditionMatchResult): Promise<void>;
}
export interface ExpeditionMatchingRegistry {
  register(
    period: Row,
    admission: Row,
    configuration: ExpeditionMatchConfiguration | undefined,
    now: bigint,
  ): Promise<void>;
  finalize(
    period: Row,
    configuration: ExpeditionMatchConfiguration | undefined,
    now: bigint,
  ): Promise<void>;
  result(period: Row, kingdomId: number): Promise<ExpeditionMatchResult | undefined>;
}
