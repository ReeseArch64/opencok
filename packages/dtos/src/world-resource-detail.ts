export class WorldResourceOwnerDto {
  declare public readonly q: number;
  declare public readonly tq: number;
  declare public readonly collected: number;
  declare public readonly spd: number;
  declare public readonly sdt: bigint;
  declare public readonly changeCollectSpdTime: bigint;
  declare public readonly occupyEndTime: bigint;
}

export class WorldResourceGroupDto {
  declare public readonly spd?: number;
  declare public readonly tq?: number;
  declare public readonly sdt?: number;
}

export class WorldNeutralResourceDto {
  declare public readonly occupybegintime?: bigint;
}
