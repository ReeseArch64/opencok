export interface SharedUserInfoResponse {
  readonly uid: string;
  readonly name: string;
  readonly pic?: string;
  readonly picVer: number;
  readonly picfraId: number;
  readonly power?: bigint;
  readonly abbr?: string;
  readonly lang?: string;
  readonly mainBuildingLevel?: number;
  readonly allianceId?: string;
  readonly gmFlag: number;
  readonly crossFightSrcServerId: number;
  readonly vipLevel: number;
  readonly svipLevel: number;
  readonly vipEndTime?: bigint;
  readonly offLineTime?: bigint;
  readonly rank: number;
}
