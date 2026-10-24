import type { GeneralInfoDto } from "./profile.ts";

export class ReconnectBalancesDto {
  readonly gold!: bigint;
  readonly dmmGold!: bigint;
  readonly dmmPaidGold!: bigint;
  readonly dmmPaidSpecialGold!: bigint;
  readonly freeGold!: bigint;
  readonly paidGold!: bigint;
  readonly paidSpecialGold!: bigint;
}

export class ReconnectArmyDto {
  readonly id!: string;
  readonly free!: number;
  readonly march!: number;
  readonly level!: number;
  readonly train?: number;
  readonly finish?: bigint;
}

export class ReconnectArmiesDto {
  readonly army!: ReconnectArmyDto[];
}

export class ReconnectGeneralsDto {
  readonly userGenerals!: (GeneralInfoDto & { readonly abilityIndex: number })[];
}

export class ReconnectMineDto {
  readonly mine!: {
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

import type { QueueDto } from "./city.ts";
import type { RewardPreviewDto } from "./rewards.ts";

export class ReconnectQueuesDto {
  readonly queue!: QueueDto[];
}

export class ReconnectResourceDto {
  readonly wood!: bigint;
  readonly stone!: bigint;
  readonly iron!: bigint;
  readonly food!: bigint;
  readonly wood_bind?: bigint;
  readonly stone_bind?: bigint;
  readonly iron_bind?: bigint;
  readonly food_bind?: bigint;
  readonly silver!: number;
  readonly chip!: number;
  readonly diamond!: number;
  readonly dragonFood!: number;
  readonly dragonGold!: number;
  readonly sandstone!: number;
  readonly diamondstone!: number;
  readonly marble!: number;
  readonly granite!: number;
  readonly limestone!: number;
}

export class ReconnectResourcesDto {
  readonly resource!: ReconnectResourceDto;
}

export class ReconnectTaskDto {
  readonly id!: string;
  readonly num!: number;
  readonly state!: number;
  readonly type!: number;
  readonly currPhase?: number;
  readonly maxPhase?: number;
  readonly reward?: RewardPreviewDto[];
}

export class ReconnectTasksDto {
  readonly task!: ReconnectTaskDto[];
  readonly ckfTask!: ReconnectTaskDto[];
  readonly taskCompleteNum!: number;
}
