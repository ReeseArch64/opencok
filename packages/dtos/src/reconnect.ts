import type { GeneralInfoDto } from "./profile.ts";

export class ReconnectBalancesDto {
  declare public readonly gold: bigint;
  declare public readonly dmmGold: bigint;
  declare public readonly dmmPaidGold: bigint;
  declare public readonly dmmPaidSpecialGold: bigint;
  declare public readonly freeGold: bigint;
  declare public readonly paidGold: bigint;
  declare public readonly paidSpecialGold: bigint;
}

export class ReconnectArmyDto {
  declare public readonly id: string;
  declare public readonly free: number;
  declare public readonly march: number;
  declare public readonly level: number;
  declare public readonly train?: number;
  declare public readonly finish?: bigint;
}

export class ReconnectArmiesDto {
  declare public readonly army: ReconnectArmyDto[];
}

export class ReconnectGeneralsDto {
  declare public readonly userGenerals: (GeneralInfoDto & { readonly abilityIndex: number })[];
}

export class ReconnectMineDto {
  declare public readonly mine: {
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
