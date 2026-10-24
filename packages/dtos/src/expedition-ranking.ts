export class ExpeditionRankingDto {
  declare public readonly selfRanking?: number;
  declare public readonly serverRanking?: {
    readonly uid: string;
    readonly name: string;
    readonly pic: string;
    readonly abbr: string;
    readonly score: number;
    readonly rank: number;
    readonly picVer: number;
    readonly serverId: number;
    readonly power: number | bigint;
  }[];
}
