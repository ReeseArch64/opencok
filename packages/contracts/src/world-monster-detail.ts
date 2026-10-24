export interface WorldMonsterHealth {
  current: number;
  maximum: number;
}

export interface WorldExplorationDetail {
  report: Buffer | null;
  startTime: bigint;
  endTime: bigint;
}
