export interface FightRankingMemberResponse {
  readonly rankNum: number;
  readonly id: string;
  readonly teamId: string;
  readonly name: string;
  readonly winNum: number;
  readonly failNum: number;
  readonly killNum: number;
  readonly score: number;
  readonly awardNum: number;
  readonly holdNum: number;
  readonly campType: number;
}

export interface PlayoffRankingTeamResponse {
  readonly kingId: number;
  readonly kingName: string;
  readonly teamId: string;
  readonly name: string;
  readonly abbr: string;
  readonly icon: string;
  readonly curmember: number;
  readonly fighting: number;
  readonly fightPower: bigint;
  readonly rankNum: number;
  readonly start: bigint;
  readonly end: bigint;
  readonly groupId: number;
  readonly ticketPayed: boolean;
}

export interface PlayoffRankingResponse {
  readonly battleState?: number;
  readonly endTime?: bigint;
  readonly teamId: string;
  readonly enemyId: string;
  readonly inBattle: boolean;
  readonly state: number;
  readonly turns: number;
  readonly groups: PlayoffRankingTeamResponse[];
}

export interface FightRankingResponse {
  readonly rank?: FightRankingMemberResponse[];
}
