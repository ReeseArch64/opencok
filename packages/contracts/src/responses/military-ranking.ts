export interface MilitaryRankingEntryResponse {
  readonly serverId: string;
  readonly uid: string;
  readonly serverName: string;
  readonly name: string;
  readonly pic: string;
  readonly abbr: string;
  readonly militaryScore?: number;
  readonly rankingExp?: number;
  readonly militaryRank?: number;
  readonly ranking: number;
}
export interface MilitaryRankingResponse {
  readonly playerArr: MilitaryRankingEntryResponse[];
  readonly selfRanking: number;
}
