export interface PlayerSearchEntryResponse {
  readonly uid: string;
  readonly name?: string;
  readonly lang?: string;
  readonly pic?: string;
  readonly abbr?: string;
  readonly alliancename?: string;
  readonly allianceId?: string;
  readonly serverId: number;
  readonly picVer?: number;
  readonly level?: number;
  readonly picfraId?: number;
  readonly gmFlag?: number;
  readonly vipLevel?: number;
  readonly svipLevel?: number;
  readonly rank?: number;
  readonly crossFightSrcServerId?: number;
  readonly mainBuildingLevel?: number;
  readonly power?: bigint;
  readonly vipEndTime?: bigint;
  readonly offLineTime?: bigint;
}

export interface PlayerSearchResponse {
  readonly list: PlayerSearchEntryResponse[];
  readonly page: number;
  readonly total: bigint;
  readonly max: bigint;
  readonly key: string;
}
