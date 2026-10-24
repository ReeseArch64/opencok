export class PlayerSearchEntryDto {
  declare public readonly uid: string;
  declare public readonly name?: string;
  declare public readonly lang?: string;
  declare public readonly pic?: string;
  declare public readonly abbr?: string;
  declare public readonly alliancename?: string;
  declare public readonly allianceId?: string;
  declare public readonly serverId: number;
  declare public readonly picVer?: number;
  declare public readonly level?: number;
  declare public readonly picfraId?: number;
  declare public readonly gmFlag?: number;
  declare public readonly vipLevel?: number;
  declare public readonly svipLevel?: number;
  declare public readonly rank?: number;
  declare public readonly crossFightSrcServerId?: number;
  declare public readonly mainBuildingLevel?: number;
  declare public readonly power?: bigint;
  declare public readonly vipEndTime?: bigint;
  declare public readonly offLineTime?: bigint;
}

export class PlayerSearchDto {
  declare public readonly list: PlayerSearchEntryDto[];
  declare public readonly page: number;
  declare public readonly total: bigint;
  declare public readonly max: bigint;
  declare public readonly key: string;
}
