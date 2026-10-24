export class DonationMemberDto {
  declare public readonly uid: string;
  declare public readonly name: string;
  declare public readonly pic: string;
  declare public readonly picVer: number;
  declare public readonly picfraId: number;
  declare public readonly power: bigint;
  declare public readonly rank: number;
  declare public readonly donateTime?: bigint;
  declare public readonly alliance_honor?: number;
  declare public readonly donation?: number;
  declare public readonly key?: number;
  declare public readonly allianceId?: string;
  declare public readonly score?: number;
}
export class CemeteryMemberDto {
  declare public readonly uid: string;
  declare public readonly name: string;
  declare public readonly pic: string;
  declare public readonly picVer: number;
  declare public readonly picfraId: number;
  declare public readonly allianceId?: string;
  declare public readonly abbr?: string;
  declare public readonly alliancename?: string;
  declare public readonly useItemSum: number;
  declare public readonly deadSum: bigint;
}
export class DonationRankingDto {
  declare public readonly donateRank: DonationMemberDto[];
  declare public readonly refreshTime?: bigint;
}
export class ResourceDonationRankingDto {
  declare public readonly ranks: DonationMemberDto[];
  declare public readonly weekendTime?: bigint;
}
export class CemeteryRankingDto {
  declare public readonly myRanking: number;
  declare public readonly serverRanking: CemeteryMemberDto[];
}
