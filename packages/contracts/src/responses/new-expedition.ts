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
export interface ExpeditionPanelResponse extends ExpeditionActivityResponse {
  id: string;
  activityid?: string;
  exchange?: string;
  res_andmd5?: string;
  res_iosmd5?: string;
  popup: string;
  androidmd5?: string;
  iosmd5?: string;
  merge?: boolean;
  reward?: import("./rewards").RewardPreviewResponse[];
}
