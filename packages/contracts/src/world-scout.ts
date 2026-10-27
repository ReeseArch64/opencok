import type { Row } from "./rows";
import type { WorldResourceOwnerSnapshot } from "./world-point-detail";
export interface WorldScoutSnapshot {
  profile: Row;
  world: Row;
  point: Row;
  points: readonly Row[];
  buildings: readonly Row[];
  owner: WorldResourceOwnerSnapshot;
  targetCastle: Row | undefined;
  barbarian: Row | undefined;
}
export interface WorldScoutStore {
  read(
    observer: string,
    point: number,
    kingdomId: number,
    now: number,
  ): Promise<WorldScoutSnapshot | undefined>;
}
