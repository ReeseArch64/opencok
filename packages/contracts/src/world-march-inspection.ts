import type { Row } from "./rows";
import type { WorldResourceOwnerSnapshot } from "./world-point-detail";

export interface WorldMarchInspection {
  march: Row;
  point: Row;
  armies: readonly Row[];
  dragons: readonly Row[];
  skills: readonly Row[];
  owner: WorldResourceOwnerSnapshot;
}

export interface WorldMarchInspectionStore {
  read(
    observer: string,
    owner: string,
    id: string,
    kingdomId: number,
    now: number,
  ): Promise<WorldMarchInspection | undefined>;
}
