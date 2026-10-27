import type { Row } from "./rows";

export interface WorldUtilitySnapshot {
  profile: Row | undefined;
  world: Row | undefined;
  points: readonly Row[];
  members: readonly Row[];
  territories: readonly Row[];
}
export interface WorldUtilityStore {
  read(owner: string, point?: number, alliance?: boolean): Promise<WorldUtilitySnapshot>;
  leave(owner: string): Promise<void>;
}
