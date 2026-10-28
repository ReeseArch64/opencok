import type { ResponseValue } from "./value.ts";

export interface FlowerRankingMemberResponse
{
    readonly uid: string;
    readonly name: string;
    readonly pic: string;
    readonly picVer: number;
    readonly picfraId: number;
    readonly flowerVal: number;
}

export interface FlowerRankingResponse
{
    readonly selfRanking: number;
    readonly flowerRanking: FlowerRankingMemberResponse[];
    readonly refreshTime: bigint;
    readonly rankGlobal?: { readonly [key: string]: ResponseValue; }[];
    readonly myGRank?: number;
    readonly myHide?: number;
}
