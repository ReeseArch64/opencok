export class PlayerSummaryDto {
  declare public readonly lastUpdateTime: string;
  declare public readonly flagCountry: string;
  declare public readonly officer: string;
  declare public readonly uid: string;
  declare public readonly name: string;
  declare public readonly allianceId: string;
  declare public readonly pic: string;
  declare public readonly abbr: string;
  declare public readonly serverId: number;
  declare public readonly vipEndTime: number;
  declare public readonly svipLevel: number;
  declare public readonly picVer: number;
  declare public readonly picfraId: number;
  declare public readonly gmFlag: number;
  declare public readonly crossFightSrcServerId: number;
  declare public readonly rank: number;
  declare public readonly sLevel: number;
  declare public readonly stateId: number;
  declare public readonly vipLevel: number;
  declare public readonly showBanner?: number;
  declare public readonly endTime: bigint;
}

export class GuidePlayerSummaryDto {
  declare public readonly uid: string;
  declare public readonly pic: string;
  declare public readonly allianceId: string;
  declare public readonly name: string;
  declare public readonly abbr: string;
  declare public readonly style: string;
  declare public readonly serverId: number;
  declare public readonly sLevel: number;
  declare public readonly gmFlag: number;
  declare public readonly vipLevel: number;
  declare public readonly rank: number;
  declare public readonly crossFightSrcServerId: number;
  declare public readonly picVer: number;
  declare public readonly lastUpdateTime: number;
  declare public readonly svipLevel: number;
  declare public readonly vipEndTime: bigint;
}
