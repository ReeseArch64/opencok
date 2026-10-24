import type { DtoValue } from "./value.ts";

export class WorldMonsterHealthDto {
  readonly mchp?: number;
  readonly mmhp?: number;
}

export class WorldMonsterExplorationDto {
  readonly erp?: DtoValue[];
  readonly st?: bigint;
  readonly et?: bigint;
}
