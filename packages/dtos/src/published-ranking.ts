import type { DtoValue } from "./value.ts";

export class PublishedRankingDto {
  declare public readonly rankList: { readonly [key: string]: DtoValue }[];
  declare public readonly myRank: number;
  declare public readonly myHide: number;
}

export class AttributeRankingDto {
  declare public readonly rankMap: { readonly [key: string]: DtoValue }[];
}
