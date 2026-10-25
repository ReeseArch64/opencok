export interface ExpeditionActivityResponse {
  state: number;
  score: string;
  alliancescore: number;
  rank: number;
  kingdominfolist: readonly { serverid: number; score: string; name?: string; banner?: string }[];
  startTime: bigint;
  endTime: bigint;
  count: number;
  rewardlist?: readonly number[];
}
