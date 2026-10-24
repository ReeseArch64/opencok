export class WorldResourceOwnerDto {
  readonly q!: number;
  readonly tq!: number;
  readonly collected!: number;
  readonly spd!: number;
  readonly sdt!: bigint;
  readonly changeCollectSpdTime!: bigint;
  readonly occupyEndTime!: bigint;
}

export class WorldResourceGroupDto {
  readonly spd?: number;
  readonly tq?: number;
  readonly sdt?: number;
}

export class WorldNeutralResourceDto {
  readonly occupybegintime?: bigint;
}
