export class MilitaryRankingEntryDto {
  declare public readonly serverId: string;
  declare public readonly uid: string;
  declare public readonly serverName: string;
  declare public readonly name: string;
  declare public readonly pic: string;
  declare public readonly abbr: string;
  declare public readonly militaryScore?: number;
  declare public readonly rankingExp?: number;
  declare public readonly militaryRank?: number;
  declare public readonly ranking: number;
}
export class MilitaryRankingDto {
  declare public readonly playerArr: MilitaryRankingEntryDto[];
  declare public readonly selfRanking: number;
}
