export interface CupMatchResponse {
  id: string;
  startBetTime: bigint;
  startTime: bigint;
  vs: string;
  odds: string;
  timeFormat: string;
  betCount: number;
}
export interface CupBetResponse {
  uuid: string;
  uid: string;
  matchId: string;
  resourceType: number;
  betNum: number;
  betSide: string;
  winner: string;
  ended: number;
  rewarded: number;
  odds: number;
  vs: string;
  timeFormat?: string;
}
