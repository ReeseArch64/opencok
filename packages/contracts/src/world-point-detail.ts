import type { Row } from "./rows.ts";

export interface WorldPointDetailQuery {
  point: number;
  kingdomId: number;
  now: number;
}

export interface WorldPointOwnerSnapshot {
  profile?: Row;
  statistics?: Row;
  registration?: Row;
  alliance?: Row;
  member?: Row;
}

export interface WorldPointDetailSnapshot {
  profile: Row | undefined;
  world?: Row;
  kingdomId: number;
  remote: boolean;
  point?: Row;
  owner?: WorldPointOwnerSnapshot;
  exploration?: { march: Row | undefined };
  neutralResource?: { march: Row | undefined };
}

export type WorldExplorationSelector = (point: Row, marches: readonly Row[]) => string | undefined;

export interface WorldPointDetailStore {
  read(
    observer: string,
    query: WorldPointDetailQuery,
    selectExploration?: WorldExplorationSelector,
  ): Promise<WorldPointDetailSnapshot>;
}

export interface WorldPointOwnerDetail {
  uid?: string;
  registerTime?: bigint;
  pic?: string;
  power?: bigint;
  killArmy?: bigint;
  afn?: string;
  rank?: number;
  vl?: number;
}
