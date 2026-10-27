import type { Row } from "./rows";

export interface CupBettingState {
  matches: readonly Row[];
  bets: readonly Row[];
}

export interface CupScheduleStore {
  reconcile(definitions: readonly Row[], now: bigint): Promise<void>;
}

export interface CupBettingWrite {
  matches?: readonly Row[];
  bets?: readonly Row[];
}
