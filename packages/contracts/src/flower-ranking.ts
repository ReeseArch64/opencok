import type { Row } from "./rows.ts";
export interface FlowerRankingPublication {
  local: readonly string[];
  selfRank: number;
  global: readonly string[];
}
export interface FlowerRankingState {
  profile: Row | undefined;
  profiles: readonly Row[];
  hide: number;
  time: bigint | undefined;
}
