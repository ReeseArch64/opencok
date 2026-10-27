import type { Row } from "./rows";

export interface DragonTowerState {
  user?: Row;
  layers: readonly Row[];
  buffs: readonly Row[];
  serverOpenedAt: bigint;
  rankMax: number;
  rankWeekly: number;
  historyMax: number;
  weeklyRanking?: readonly Row[];
  historyRanking?: readonly Row[];
  reports?: readonly Row[];
}

export interface DragonTowerWrite {
  user?: Row;
  layers?: readonly Row[];
  buffs?: readonly Row[];
}
