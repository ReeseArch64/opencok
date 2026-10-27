import type { Row } from "./rows";

export interface EggActivityState {
  record?: Row;
  collections: readonly Row[];
}

export interface EggActivityWrite {
  record?: Row;
  collection?: Row;
}
