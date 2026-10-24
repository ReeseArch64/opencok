export interface PlayerStatisticsResponse {
  readonly battleWin: number;
  readonly battleLose: number;
  readonly attackWin: number;
  readonly attackLose: number;
  readonly defenseWin: number;
  readonly detectNum: number;
  readonly armyDead: number;
  readonly armyCure: number;
  readonly cityDes: number;
  readonly armyKill: bigint;
}

export interface PowerInfoResponse {
  readonly battleWin: number;
  readonly battleLose: number;
  readonly attackWin: number;
  readonly attackLose: number;
  readonly defenseWin: number;
  readonly detectNum: number;
  readonly armyDead: number;
  readonly armyCure: number;
  readonly cityDes: number;
  readonly armyKill: bigint;
  readonly playerPower: number;
  readonly heroPower: number;
  readonly buildingPower: number;
  readonly sciencePower: number;
  readonly civilizationSciencePower: number;
  readonly questpower: number;
  readonly equipPower: number;
  readonly knight_title: number;
  readonly sagatower_science: number;
  readonly banCount: number;
  readonly armyPower: bigint;
  readonly fortPower: bigint;
  readonly petDragonPower: bigint;
  readonly prinessPower: bigint;
  readonly nextUpdateTime: bigint;
  readonly banTime: bigint;
}
