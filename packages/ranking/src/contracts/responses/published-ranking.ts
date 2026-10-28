import type { ResponseValue } from "@opencok/messages/contracts/response-value";

export interface PublishedRankingResponse
{
    readonly rankList: { readonly [key: string]: ResponseValue; }[];
    readonly myRank: number;
    readonly myHide: number;
}

export interface AttributeRankingResponse
{
    readonly rankMap: { readonly [key: string]: ResponseValue; }[];
}
