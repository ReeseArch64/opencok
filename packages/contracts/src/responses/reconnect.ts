export interface ReconnectBalancesResponse
{
    readonly gold: bigint;
    readonly dmmGold: bigint;
    readonly dmmPaidGold: bigint;
    readonly dmmPaidSpecialGold: bigint;
    readonly freeGold: bigint;
    readonly paidGold: bigint;
    readonly paidSpecialGold: bigint;
}

export interface ReconnectArmyResponse
{
    readonly id: string;
    readonly free: number;
    readonly march: number;
    readonly level: number;
    readonly train?: number;
    readonly finish?: bigint;
}

export interface ReconnectArmiesResponse
{
    readonly army: ReconnectArmyResponse[];
}

export interface ReconnectMineResponse
{
    readonly mine: {
        readonly itemId: number;
        readonly level: number;
        readonly exp: number;
        readonly miner: number;
        readonly call: number;
        readonly xml_exp: number;
        readonly xml_miner: number;
        readonly mineTime: bigint;
    };
}

import type { QueueResponse } from "./city.ts";
import type { RewardPreviewResponse } from "./rewards.ts";

export interface ReconnectQueuesResponse
{
    readonly queue: QueueResponse[];
}

export interface ReconnectResourceResponse
{
    readonly wood: bigint;
    readonly stone: bigint;
    readonly iron: bigint;
    readonly food: bigint;
    readonly wood_bind?: bigint;
    readonly stone_bind?: bigint;
    readonly iron_bind?: bigint;
    readonly food_bind?: bigint;
    readonly silver: number;
    readonly chip: number;
    readonly diamond: number;
    readonly dragonFood: number;
    readonly dragonGold: number;
    readonly sandstone: number;
    readonly diamondstone: number;
    readonly marble: number;
    readonly granite: number;
    readonly limestone: number;
}

export interface ReconnectResourcesResponse
{
    readonly resource: ReconnectResourceResponse;
}

export interface ReconnectTaskResponse
{
    readonly id: string;
    readonly num: number;
    readonly state: number;
    readonly type: number;
    readonly currPhase?: number;
    readonly maxPhase?: number;
    readonly reward?: RewardPreviewResponse[];
}

export interface ReconnectTasksResponse
{
    readonly task: ReconnectTaskResponse[];
    readonly ckfTask: ReconnectTaskResponse[];
    readonly taskCompleteNum: number;
}
