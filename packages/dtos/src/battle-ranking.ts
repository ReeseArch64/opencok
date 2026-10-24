export class FightRankingMemberDto {
  declare public readonly rankNum: number;
  declare public readonly id: string;
  declare public readonly teamId: string;
  declare public readonly name: string;
  declare public readonly winNum: number;
  declare public readonly failNum: number;
  declare public readonly killNum: number;
  declare public readonly score: number;
  declare public readonly awardNum: number;
  declare public readonly holdNum: number;
  declare public readonly campType: number;
}
export class PlayoffRankingTeamDto {
  declare public readonly kingId: number;
  declare public readonly kingName: string;
  declare public readonly teamId: string;
  declare public readonly name: string;
  declare public readonly abbr: string;
  declare public readonly icon: string;
  declare public readonly curmember: number;
  declare public readonly fighting: number;
  declare public readonly fightPower: bigint;
  declare public readonly rankNum: number;
  declare public readonly start: bigint;
  declare public readonly end: bigint;
  declare public readonly groupId: number;
  declare public readonly ticketPayed: boolean;
}
export class PlayoffRankingDto {
  declare public readonly battleState?: number;
  declare public readonly endTime?: bigint;
  declare public readonly teamId: string;
  declare public readonly enemyId: string;
  declare public readonly inBattle: boolean;
  declare public readonly state: number;
  declare public readonly turns: number;
  declare public readonly groups: PlayoffRankingTeamDto[];
}
export class FightRankingDto {
  declare public readonly rank?: FightRankingMemberDto[];
}
