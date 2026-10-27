export interface ArenaInfoResponse {
  state: number;
  rankScore: number;
  time: bigint;
}

export interface ArenaArmyResponse {
  armyArray: readonly { armyId: string; count: number }[];
}
