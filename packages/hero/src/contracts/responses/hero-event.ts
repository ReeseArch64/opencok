import type { RewardPreviewResponse } from "@opencok/contracts/responses/rewards";

export interface HeroScoreResponse {
  uid: string;
  actId: string;
  score: number;
  level: number;
  finishFlag: number;
  rewardFlagList: string;
}

export interface HeroEventEntryResponse {
  eventId: string;
  actId: string;
  t: number;
  st: bigint;
  et: bigint;
  score: string;
  value: string;
  reward: readonly (readonly RewardPreviewResponse[])[];
  target: string;
  userScore: HeroScoreResponse | Record<string, never>;
}

export interface HeroEventInfoResponse {
  eventList: readonly HeroEventEntryResponse[];
  type: number;
  vsCountry?: readonly { id: number; rank: number; name?: string; banner?: string }[];
  ranking?: number;
  rankingAlliance?: number;
}

export interface HeroEventRewardResponse {
  reward: readonly (readonly RewardPreviewResponse[])[];
  rewardArr?: string;
  levelArr?: string;
}

export interface HeroPanelResponse {
  activityid: string;
  startTime: bigint;
  endTime?: bigint;
  merge?: boolean;
  id: string;
  reward?: readonly RewardPreviewResponse[];
  exchange?: string;
  res_andmd5?: string;
  res_iosmd5?: string;
  popup: string;
  androidmd5?: string;
  iosmd5?: string;
}
