export class ThroneRankingEntryDto {
  declare public readonly uid: string;
  declare public readonly rank: number;
  declare public readonly killCount: bigint;
  declare public readonly deadCount: bigint;
  declare public readonly name: string;
  declare public readonly allianceName: string;
  declare public readonly serverId: number;
  declare public readonly abbr: string;
  declare public readonly kingdomName: string;
}
export class ThroneRankingBoardDto {
  declare public readonly list: ThroneRankingEntryDto[];
  declare public readonly selfRank: number;
  declare public readonly serverId: number;
}
export class ThroneRankingDto {
  declare public readonly rank: ThroneRankingBoardDto[];
}
