export interface HeroSelfRankingResponse
{
    readonly eventList: never[];
    readonly ranking: number;
    readonly rankingAlliance: number;
    readonly type: number;
}

export interface HeroInsideMemberResponse
{
    readonly uid?: string;
    readonly name?: string;
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
    readonly score: number;
}

export interface HeroInsideRankingResponse
{
    readonly rankList: HeroInsideMemberResponse[];
}

export interface HeroHistoryMemberResponse
{
    readonly uid?: string;
    readonly allianceId?: string;
    readonly rewardId: string;
    readonly rank: number;
    readonly name?: string;
    readonly server?: number;
    readonly pic?: string;
    readonly picVer?: number;
    readonly picfraId?: number;
    readonly abbr?: string;
    readonly icon?: string;
}

export interface HeroHistoryRealmResponse
{
    readonly id: number;
    readonly rank: number;
    readonly name?: string;
    readonly banner?: string;
}

export interface HeroHistoryEntryResponse
{
    readonly eventId: string;
    readonly endTime: bigint;
    readonly userList: HeroHistoryMemberResponse[];
    readonly kingdomList: HeroHistoryRealmResponse[];
}

export interface HeroHistoryResponse
{
    readonly history: HeroHistoryEntryResponse[];
}
