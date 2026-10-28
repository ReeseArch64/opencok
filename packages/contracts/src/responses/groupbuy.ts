import type { RewardPreviewResponse } from "./rewards";

export interface GroupBuyResponse
{
    rewardArr: readonly {
        level: number;
        reward: readonly RewardPreviewResponse[];
        rewardId: string;
    }[];
    buyMax: number;
    exchangeArr: readonly {
        exchangeId: string;
        product_id: string;
        dollar: string;
        exchangePoint: number;
    }[];
    totalBuy: number;
    buyArr: readonly { name: string; uid: string; point: number; time: bigint; }[];
    userPoint: number;
    canBuy: boolean;
    buyCode?: string;
    sTime: bigint;
    eTime: bigint;
    cTime: bigint;
}
