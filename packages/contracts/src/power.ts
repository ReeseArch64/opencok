import type { Row } from "./rows.ts";

export interface GeneralSkill {
  id: string;
  points: number;
}

export interface WorldPowerEffect {
  id: number;
  value: string;
  endTime: bigint | undefined;
}

export interface PowerSnapshot {
  profile: Row;
  statistics: Row | undefined;
  generals: readonly Row[];
  armies: readonly Row[];
  walls: readonly Row[];
  buildings: readonly Row[];
  sciences: readonly Row[];
  civilizationSciences: readonly Row[];
  sagaSciences: readonly Row[];
  foreignSciences: readonly Row[];
  equipment: readonly Row[];
  heroes: readonly Row[];
  dragons: readonly Row[];
  dragonSkills: readonly Row[];
  knight: Row | undefined;
  items: readonly Row[];
  states: readonly Row[];
  vip: Row | undefined;
  allianceSciences: readonly Row[];
  prestige: readonly Row[];
  military: Row | undefined;
  miracle: Row | undefined;
  office: Row | undefined;
  kingdomFights: readonly Row[];
  territoryTrees: readonly Row[];
}

export interface PowerState extends Omit<PowerSnapshot, "profile"> {
  profile: Row | undefined;
  upload: Row | undefined;
}

export interface PowerContext {
  now: number;
  dragonLevelUp: boolean;
  dragonScience: boolean;
  dragonAttackPercent?: number;
  contractTitleExpiries: ReadonlyMap<string, bigint>;
}

export interface PlayerPower {
  playerPower: number;
  heroPower: number;
  armyPower: bigint;
  buildingPower: number;
  sciencePower: number;
  civilizationSciencePower: number;
  fortPower: bigint;
  questpower: number;
  equipPower: number;
  knight_title: number;
  petDragonPower: bigint;
  sagatower_science: number;
  prinessPower: bigint;
  total: bigint;
}
