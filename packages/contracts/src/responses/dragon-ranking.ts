export interface DragonRankingResponse
{
    readonly rank: {
        readonly teamId: string;
        readonly allianceId: string;
        readonly name: string;
        readonly leader: string;
        readonly kingName: string;
        readonly icon: string;
        readonly abbr: string;
        readonly teamState: number;
        readonly score: number;
        readonly kingId: number;
        readonly wins2: number;
        readonly curmember: number;
        readonly maxmember: number;
        readonly fighting: number;
        readonly rankNum: number;
        readonly type: number;
        readonly fightPower: bigint;
        readonly wins: number;
    }[];
}
