import type { Row } from "./rows";

export interface OlympicState {
  questions: readonly Row[];
  bets: readonly Row[];
  winningStake(id: string, result: string): Promise<bigint>;
}

export interface OlympicWrite {
  questions?: readonly Row[];
  bets?: readonly Row[];
}

export interface OlympicScheduleStore {
  reconcile(definitions: readonly Row[], enabled: boolean, now: bigint): Promise<void>;
}
