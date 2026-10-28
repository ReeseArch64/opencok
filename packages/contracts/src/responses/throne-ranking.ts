export interface ThroneRankingEntryResponse
{
    readonly uid: string;
    readonly rank: number;
    readonly killCount: bigint;
    readonly deadCount: bigint;
    readonly name: string;
    readonly allianceName: string;
    readonly serverId: number;
    readonly abbr: string;
    readonly kingdomName: string;
}

export interface ThroneRankingBoardResponse
{
    readonly list: ThroneRankingEntryResponse[];
    readonly selfRank: number;
    readonly serverId: number;
}

export interface ThroneRankingResponse
{
    readonly rank: ThroneRankingBoardResponse[];
}
