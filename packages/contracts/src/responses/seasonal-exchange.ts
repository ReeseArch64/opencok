import type { ResponseValue } from "@opencok/messages/contracts/response-value";

export interface SeasonalExchangeResponse
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
