import type { DtoValue } from "./value.ts";

export class WorldMonsterHealthDto {
  declare public readonly mchp?: number;
  declare public readonly mmhp?: number;
}

export class WorldMonsterExplorationDto {
  declare public readonly erp?: DtoValue[];
  declare public readonly st?: bigint;
  declare public readonly et?: bigint;
}
