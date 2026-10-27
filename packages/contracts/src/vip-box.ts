import type { Row } from "./rows";
export interface VipBoxState {
  records: readonly Row[];
  history: readonly Row[];
  openedAt: bigint;
}
export interface VipBoxWrite {
  record: Row;
  history?: Row;
}
