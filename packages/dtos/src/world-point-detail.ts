export class WorldPointOwnerDto {
  declare public readonly uid?: string;
  declare public readonly pic?: string;
  declare public readonly afn?: string;
  declare public readonly registerTime?: bigint;
  declare public readonly power?: bigint;
  declare public readonly killArmy?: bigint;
  declare public readonly rank?: number;
  declare public readonly vl?: number;
}

export class WorldCityFieldsDto {
  declare public readonly slowDown: boolean;
  declare public readonly targetTooStrong: boolean;
  declare public readonly targetPower: bigint;
  declare public readonly lastBeDuelTime: bigint;
}
