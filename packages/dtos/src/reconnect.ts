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
