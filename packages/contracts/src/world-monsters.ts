import type { Row } from "./rows";
export interface WorldMonsterReader {
  nearestBoss(origin: number): Promise<number>;
  nearby(origin: number, radius: number): Promise<readonly Row[]>;
  area(area: number, side: number): Promise<readonly Row[]>;
}
