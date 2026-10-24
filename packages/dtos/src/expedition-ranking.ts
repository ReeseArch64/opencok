export class ExpeditionRankingDto {
  readonly selfRanking?: number;
  readonly serverRanking?: {
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
