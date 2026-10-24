export class WorldPointOwnerDto {
  readonly uid?: string;
  readonly pic?: string;
  readonly afn?: string;
  readonly registerTime?: bigint;
  readonly power?: bigint;
  readonly killArmy?: bigint;
  readonly rank?: number;
  readonly vl?: number;
}

export class WorldCityFieldsDto {
  readonly slowDown!: boolean;
  readonly targetTooStrong!: boolean;
  readonly targetPower!: bigint;
  readonly lastBeDuelTime!: bigint;
}
