export class SharedUserInfoDto {
  declare public readonly uid: string;
  declare public readonly name: string;
  declare public readonly pic?: string;
  declare public readonly picVer: number;
  declare public readonly picfraId: number;
  declare public readonly power?: bigint;
  declare public readonly abbr?: string;
  declare public readonly lang?: string;
  declare public readonly mainBuildingLevel?: number;
  declare public readonly allianceId?: string;
  declare public readonly gmFlag: number;
  declare public readonly crossFightSrcServerId: number;
  declare public readonly vipLevel: number;
  declare public readonly svipLevel: number;
  declare public readonly vipEndTime?: bigint;
  declare public readonly offLineTime?: bigint;
  declare public readonly rank: number;
}
