import type { ResponseValue } from "@opencok/messages/contracts/response-value";

export interface MonsterExchangeResponse
{
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
