import type { Row } from "./rows";
export type WorldMonsterFamily = "field" | "black" | "exploration" | "barbarian" | "expiry";
export interface WorldMonsterSupplyClock {
  version: 1;
  stage: "idle" | "reset" | "fill" | "seed";
  area: number;
  nextAt: bigint;
  initial: boolean;
  quota: Record<string, number>;
  remaining: Record<string, number>;
  pool: number[];
  attempts: number;
}
export interface WorldMonsterRefreshStore {
  readonly now: bigint;
  readonly opening: bigint;
  readonly monsterStart: bigint;
  readonly fresh: boolean;
  clock(family: WorldMonsterFamily): Promise<WorldMonsterSupplyClock | undefined>;
  save(family: WorldMonsterFamily, clock: WorldMonsterSupplyClock): Promise<void>;
  cells(ranges: readonly number[][]): Promise<readonly Row[]>;
  points(ids: readonly number[]): Promise<readonly Row[]>;
  expired(): Promise<readonly Row[]>;
  write(rows: readonly Row[]): Promise<void>;
  defer(rows: readonly Row[], deadline: bigint): Promise<void>;
  barbarian(
    rows: readonly Row[],
    actor?: {
      configId: string;
      currentHP: number;
      army: ReadonlyMap<string, number>;
      awards: ReadonlyMap<string, number>;
    },
  ): Promise<void>;
  tickets(): Promise<readonly Row[]>;
  population(area: number): Promise<number>;
  ticket(
    area: number,
    pointItem: string | null,
    level: number,
    deadline: bigint,
    count: number,
  ): Promise<void>;
  retry(ticket: Row, deadline: bigint): Promise<void>;
  remove(ticket: Row): Promise<void>;
}
export interface WorldMonsterRefreshExecutor {
  execute(
    at: bigint | undefined,
    work: (store: WorldMonsterRefreshStore) => Promise<void>,
  ): Promise<void>;
}
