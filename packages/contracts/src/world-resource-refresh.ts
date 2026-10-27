import type { Row } from "./rows";

export interface WorldResourceClock {
  worldId: number;
  groupStartedAt: bigint;
  usedGroups: string;
  areaCursor: number;
  nextRefreshAt: bigint;
}
export interface WorldResourceRefreshStore {
  readonly now: bigint;
  readonly opening: bigint;
  readonly goldBonusUntil: bigint;
  readonly clock: WorldResourceClock | undefined;
  expired(): Promise<readonly Row[]>;
  pending(): Promise<readonly Row[]>;
  population(area: number): Promise<number>;
  free(area: number): Promise<Row | undefined>;
  postpone(point: Row, deadline: bigint): Promise<void>;
  clear(point: Row): Promise<void>;
  ticket(area: number, level: number, type: string, deadline: bigint): Promise<void>;
  retry(ticket: Row, deadline: bigint): Promise<void>;
  removeTicket(ticket: Row): Promise<void>;
  spawn(point: Row, type: number, level: number, amount: number, deadline: bigint): Promise<void>;
  save(clock: WorldResourceClock): Promise<void>;
}
export interface WorldResourceRefreshExecutor {
  execute(now: bigint, work: (store: WorldResourceRefreshStore) => Promise<void>): Promise<void>;
}
