export interface DonationMemberResponse
{
    readonly uid: string;
    readonly name: string;
    readonly pic: string;
    readonly picVer: number;
    readonly picfraId: number;
    readonly power: bigint;
    readonly rank: number;
    readonly donateTime?: bigint;
    readonly alliance_honor?: number;
    readonly donation?: number;
    readonly key?: number;
    readonly allianceId?: string;
    readonly score?: number;
}

export interface CemeteryMemberResponse
{
    readonly uid: string;
    readonly name: string;
    readonly pic: string;
    readonly picVer: number;
    readonly picfraId: number;
    readonly allianceId?: string;
    readonly abbr?: string;
    readonly alliancename?: string;
    readonly useItemSum: number;
    readonly deadSum: bigint;
}

export interface DonationRankingResponse
{
    readonly donateRank: DonationMemberResponse[];
    readonly refreshTime?: bigint;
}

export interface ResourceDonationRankingResponse
{
    readonly ranks: DonationMemberResponse[];
    readonly weekendTime?: bigint;
}

export interface CemeteryRankingResponse
{
    readonly myRanking: number;
    readonly serverRanking: CemeteryMemberResponse[];
}
