export interface PlayerSummaryResponse
{
    readonly lastUpdateTime: string;
    readonly flagCountry: string;
    readonly officer: string;
    readonly uid: string;
    readonly name: string;
    readonly allianceId: string;
    readonly pic: string;
    readonly abbr: string;
    readonly serverId: number;
    readonly vipEndTime: number;
    readonly svipLevel: number;
    readonly picVer: number;
    readonly picfraId: number;
    readonly gmFlag: number;
    readonly crossFightSrcServerId: number;
    readonly rank: number;
    readonly sLevel: number;
    readonly stateId: number;
    readonly vipLevel: number;
    readonly showBanner?: number;
    readonly endTime: bigint;
}

export interface GuidePlayerSummaryResponse
{
    readonly uid: string;
    readonly pic: string;
    readonly allianceId: string;
    readonly name: string;
    readonly abbr: string;
    readonly style: string;
    readonly serverId: number;
    readonly sLevel: number;
    readonly gmFlag: number;
    readonly vipLevel: number;
    readonly rank: number;
    readonly crossFightSrcServerId: number;
    readonly picVer: number;
    readonly lastUpdateTime: number;
    readonly svipLevel: number;
    readonly vipEndTime: bigint;
}
