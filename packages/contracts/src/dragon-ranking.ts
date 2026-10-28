export interface DragonRankingRange
{
    start: number;
    end: number;
}

export interface DragonRankingEntry
{
    rank: number;
    json: string;
}

export interface DragonRankingTeam
{
    teamId: string;
    name: string;
    leader: string;
    teamState: number;
    score: number;
    kingId: number;
    kingName: string;
    fightNum: number;
    winNum: number;
    curmember: number;
    maxmember: number;
    fighting: number;
    fightPower: bigint;
    icon: string;
    rankNum: number;
    abbr: string;
}
