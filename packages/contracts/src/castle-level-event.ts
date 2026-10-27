import type { Row } from "./rows";

export interface CastleLevelEventRow extends Row {
  shard: number;
}

export interface CastleLevelEventState {
  rows: readonly CastleLevelEventRow[];
  counts: ReadonlyMap<number, number>;
  serverOpenTime: bigint;
  exchanges: readonly string[];
}
