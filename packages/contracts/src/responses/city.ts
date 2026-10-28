import type { ResponseValue } from "@opencok/messages/contracts/response-value";

export interface BuildingResponse
{
    readonly uuid: string;
    readonly itemId: string;
    readonly putId: string;
    readonly building: string;
    readonly star_building: string;
    readonly star_building_new: string;
    readonly unlock_type: string;
    readonly unlock_value: string;
    readonly item?: string;
    readonly para1?: string;
    readonly para2?: string;
    readonly para3?: string;
    readonly para4?: string;
    readonly para5?: string;
    readonly nextLevelParas?: string;
    readonly pos: number;
    readonly level: number;
    readonly opType: number;
    readonly starNum: number;
    readonly starRate: number;
    readonly starMax: number;
    readonly unlockFlag: number;
    readonly unlock_costNum: number;
    readonly time: number;
    readonly exp: number;
    readonly civilization_level: number;
    readonly resource: number;
    readonly ban_luckyday: number;
    readonly destroy_time: number;
    readonly power?: number;
    readonly unlock_costType?: number;
    readonly unlock_costValue?: number;
    readonly wood: bigint;
    readonly stone: bigint;
    readonly iron: bigint;
    readonly food: bigint;
    readonly silver: bigint;
    readonly refreshTime?: bigint;
    readonly cdTime?: bigint;
    readonly effectTime?: bigint;
}

export interface QueueResponse
{
    readonly uuid: string;
    readonly qid: number;
    readonly type: number;
    readonly isHelped?: number;
    readonly startTime: bigint;
    readonly endTime: bigint;
    readonly updateTime: bigint;
    readonly totalTime: bigint;
    readonly itemObj: { readonly [key: string]: ResponseValue; };
}

export interface ResourceResponse
{
    readonly wood: bigint;
    readonly wood_bind: bigint;
    readonly stone: bigint;
    readonly stone_bind: bigint;
    readonly iron: bigint;
    readonly iron_bind: bigint;
    readonly food: bigint;
    readonly food_bind: bigint;
    readonly silver: number;
    readonly chip: number;
    readonly diamond: number;
    readonly sandstone: number;
    readonly diamondstone: number;
    readonly marble: number;
    readonly granite: number;
    readonly limestone: number;
    readonly dragonFood: number;
    readonly dragonGold: number;
}

export interface UserResponse
{
    readonly buildcode: string;
    readonly uuid: string;
    readonly newCountry: string;
    readonly uid: string;
    readonly name: string;
    readonly allianceId: string;
    readonly openedPos: string;
    readonly pic: string;
    readonly guideStep: string;
    readonly serverType: number;
    readonly civilization_type: number;
    readonly serverId: number;
    readonly serverMax: number;
    readonly country: number;
    readonly maxExp: number;
    readonly level: number;
    readonly exp: number;
    readonly chNameCount: number;
    readonly picVer: number;
    readonly picfraId: number;
    readonly gmFlag: number;
    readonly crossFightSrcServerId: number;
    readonly civilization_score: bigint;
    readonly civilization_prestige: bigint;
    readonly gold: bigint;
    readonly freeGold: bigint;
    readonly material: bigint;
    readonly allBuildScore: bigint;
    readonly paidGold: bigint;
    readonly paidSpecialGold: bigint;
    readonly crystal: bigint;
    readonly crystalGold: bigint;
    readonly dmmGold: bigint;
    readonly dmmPaidGold: bigint;
    readonly dmmPaidSpecialGold: bigint;
    readonly payTotal: bigint;
    readonly regTime: bigint;
    readonly neutralScore: bigint;
    readonly csmodBalance: bigint;
    readonly payTotalDollar: number;
}
