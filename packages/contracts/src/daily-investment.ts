import type { Row } from "./rows";
export interface DailyInvestmentState {
  record?: Row;
  serverOpenTime: bigint;
}
