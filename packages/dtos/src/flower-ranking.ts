import type { DtoValue } from "./value.ts";
export class FlowerRankingMemberDto {
  declare public readonly uid: string;
  declare public readonly name: string;
  declare public readonly pic: string;
  declare public readonly picVer: number;
  declare public readonly picfraId: number;
  declare public readonly flowerVal: number;
}
export class FlowerRankingDto {
  declare public readonly selfRanking: number;
  declare public readonly flowerRanking: FlowerRankingMemberDto[];
  declare public readonly refreshTime: bigint;
  declare public readonly rankGlobal?: { readonly [key: string]: DtoValue }[];
  declare public readonly myGRank?: number;
  declare public readonly myHide?: number;
}
