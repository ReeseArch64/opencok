import type { Row } from "./rows";
export interface CostRankMail {
  sender: string;
  title: string;
  contents: string;
  reward: string | null;
}
export interface CostRankAwardReader {
  load(id: string): Promise<Row | undefined>;
}
export interface CostRankAwardStore {
  candidates(): Promise<readonly Row[]>;
  plan(
    closure: Row,
    standing: Row,
    create: (() => CostRankMail) | undefined,
    now: bigint,
  ): Promise<void>;
  finished(closure: Row, count: number, now: bigint): Promise<void>;
  pending(now: bigint): Promise<readonly Row[]>;
  defer(id: string, now: bigint): Promise<void>;
}
