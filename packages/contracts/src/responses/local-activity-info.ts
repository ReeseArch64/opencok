import type { RewardPreviewResponse } from "./rewards";

export interface ClosedActivitiesResponse
{
    act_close: readonly { id: string; close: string; }[];
}

export interface CatalogRewardResponse
{
    award: readonly RewardPreviewResponse[];
    rewardId: string;
    reward_list: {
        item?: string;
        num?: string;
        wood?: string;
        food?: string;
        iron?: string;
        stone?: string;
        gold?: string;
        prestige?: string;
    };
}
