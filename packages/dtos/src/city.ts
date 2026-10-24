import type { DtoValue } from "./value.ts";

export class BuildingDto {
  declare public readonly uuid: string;
  declare public readonly itemId: string;
  declare public readonly putId: string;
  declare public readonly building: string;
  declare public readonly star_building: string;
  declare public readonly star_building_new: string;
  declare public readonly unlock_type: string;
  declare public readonly unlock_value: string;
  declare public readonly item?: string;
  declare public readonly para1?: string;
  declare public readonly para2?: string;
  declare public readonly para3?: string;
  declare public readonly para4?: string;
  declare public readonly para5?: string;
  declare public readonly nextLevelParas?: string;
  declare public readonly pos: number;
  declare public readonly level: number;
  declare public readonly opType: number;
  declare public readonly starNum: number;
  declare public readonly starRate: number;
  declare public readonly starMax: number;
  declare public readonly unlockFlag: number;
  declare public readonly unlock_costNum: number;
  declare public readonly time: number;
  declare public readonly exp: number;
  declare public readonly civilization_level: number;
  declare public readonly resource: number;
  declare public readonly ban_luckyday: number;
  declare public readonly destroy_time: number;
  declare public readonly power?: number;
  declare public readonly unlock_costType?: number;
  declare public readonly unlock_costValue?: number;
  declare public readonly wood: bigint;
  declare public readonly stone: bigint;
  declare public readonly iron: bigint;
  declare public readonly food: bigint;
  declare public readonly silver: bigint;
  declare public readonly refreshTime?: bigint;
  declare public readonly cdTime?: bigint;
  declare public readonly effectTime?: bigint;
}

export class QueueDto {
  declare public readonly uuid: string;
  declare public readonly qid: number;
  declare public readonly type: number;
  declare public readonly isHelped?: number;
  declare public readonly startTime: bigint;
  declare public readonly endTime: bigint;
  declare public readonly updateTime: bigint;
  declare public readonly totalTime: bigint;
  declare public readonly itemObj: { readonly [key: string]: DtoValue };
}

export class ResourceDto {
  declare public readonly wood: bigint;
  declare public readonly wood_bind: bigint;
  declare public readonly stone: bigint;
  declare public readonly stone_bind: bigint;
  declare public readonly iron: bigint;
  declare public readonly iron_bind: bigint;
  declare public readonly food: bigint;
  declare public readonly food_bind: bigint;
  declare public readonly silver: number;
  declare public readonly chip: number;
  declare public readonly diamond: number;
  declare public readonly sandstone: number;
  declare public readonly diamondstone: number;
  declare public readonly marble: number;
  declare public readonly granite: number;
  declare public readonly limestone: number;
  declare public readonly dragonFood: number;
  declare public readonly dragonGold: number;
}

export class UserDto {
  declare public readonly buildcode: string;
  declare public readonly uuid: string;
  declare public readonly newCountry: string;
  declare public readonly uid: string;
  declare public readonly name: string;
  declare public readonly allianceId: string;
  declare public readonly openedPos: string;
  declare public readonly pic: string;
  declare public readonly guideStep: string;
  declare public readonly serverType: number;
  declare public readonly civilization_type: number;
  declare public readonly serverId: number;
  declare public readonly serverMax: number;
  declare public readonly country: number;
  declare public readonly maxExp: number;
  declare public readonly level: number;
  declare public readonly exp: number;
  declare public readonly chNameCount: number;
  declare public readonly picVer: number;
  declare public readonly picfraId: number;
  declare public readonly gmFlag: number;
  declare public readonly crossFightSrcServerId: number;
  declare public readonly civilization_score: bigint;
  declare public readonly civilization_prestige: bigint;
  declare public readonly gold: bigint;
  declare public readonly freeGold: bigint;
  declare public readonly material: bigint;
  declare public readonly allBuildScore: bigint;
  declare public readonly paidGold: bigint;
  declare public readonly paidSpecialGold: bigint;
  declare public readonly crystal: bigint;
  declare public readonly crystalGold: bigint;
  declare public readonly dmmGold: bigint;
  declare public readonly dmmPaidGold: bigint;
  declare public readonly dmmPaidSpecialGold: bigint;
  declare public readonly payTotal: bigint;
  declare public readonly regTime: bigint;
  declare public readonly neutralScore: bigint;
  declare public readonly csmodBalance: bigint;
  declare public readonly payTotalDollar: number;
}
