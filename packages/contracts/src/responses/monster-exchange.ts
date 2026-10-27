import type { ResponseValue } from "./value";
export interface MonsterExchangeResponse {
  level: number;
  refreshTime: bigint;
  flushTimes: number;
  rewards: readonly {
    rewardId: string;
    level: number;
    needNum: number;
    color: number;
    reward: readonly ResponseValue[];
  }[];
  receiveLevels: string;
}
