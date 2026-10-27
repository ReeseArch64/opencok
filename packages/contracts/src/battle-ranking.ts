import type { Row } from "./rows.ts";

export interface BattleRankingState {
  profile: Row | undefined;
  realmType: number;
  openedAt: bigint;
  observerTeam: string | undefined;
  tickets: readonly string[];
}

export interface PlayoffPublication {
  state: number;
  turns: number;
  start: bigint;
  duration: bigint;
  teams: readonly string[];
}

export interface PlayoffTeam {
  teamId: string;
  name: string;
  kingId: number;
  kingName: string;
  abbr: string;
  icon: string;
  curmember: number;
  fighting: number;
  fightPower: bigint;
  rankNum: number;
  groupId: number;
  index: number;
  score: number;
  results: readonly number[];
  enemyIds: readonly (string | null)[];
  curEnemyId: string | null;
}
