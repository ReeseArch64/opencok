import type { Row } from "./rows";

export type MilitaryRankAwardKind = "military" | "milhonor";

export interface MilitaryRankAward {
  kind: MilitaryRankAwardKind;
  amount: number;
}

export interface MilitaryRankAwardSnapshot {
  row: Row | undefined;
  clockMarker: bigint | undefined;
}

export interface MilitaryRankAwardReader {
  load(): Promise<MilitaryRankAwardSnapshot>;
}

export interface MilitaryRankAwardWrite {
  owner: string;
  kingdomId: number;
  entitlementId: string;
  clockMarker: bigint;
  periodEnd: bigint;
  before: Row | undefined;
  after: Row;
  honorCap: number;
  awards: readonly MilitaryRankAward[];
}

export type { MilitaryRankAwardResponse } from "./responses/military-rank-awards";
