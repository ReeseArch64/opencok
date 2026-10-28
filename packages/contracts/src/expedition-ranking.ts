import type { Row } from "./rows.ts";

export interface ExpeditionRankingEntry
{
    uid: string;
    score: number;
    info: string | null;
}

export interface ExpeditionRankingCandidate
{
    uid: string;
    score: number;
    profile: Row | undefined;
}

export interface ExpeditionRankingResult
{
    rows: {
        uid: string;
        score: number;
        rank: number;
        name: string;
        pic: string;
        picVer: number;
        abbr: string;
        serverId: number;
        power: bigint;
    }[];
    selfRanking: number;
}
