import type { Row } from "./rows";
export interface SevenDayCycleState {
  cycle?: Row;
  draws: readonly Row[];
  history: readonly Row[];
}
export interface SevenDayCycleWrite {
  cycle?: Row;
  draw?: Row;
  history?: Row;
}
export interface SevenDayPaymentGateway {
  accept(input: { owner: string; eventId: string; exchangeId: string }): Promise<boolean>;
}
