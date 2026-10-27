import type { Row } from "./rows";

export interface WorldResourceNewClock {
  version: 1;
  areaCursor: number;
  nextRefreshAt: string;
}
export interface WorldResourceNewStore {
  readonly now: bigint;
  readonly clock: WorldResourceNewClock | undefined;
  expired(): Promise<readonly Row[]>;
  occupied(point: Row): Promise<boolean>;
  postpone(point: Row, deadline: bigint): Promise<void>;
  clear(point: Row): Promise<void>;
  clearOrphans(): Promise<number>;
  pending(): Promise<readonly Row[]>;
  population(area: number): Promise<number>;
  ticket(point: Row): Promise<void>;
  retry(ticket: Row): Promise<void>;
  removeTicket(ticket: Row): Promise<void>;
  spawn(area: number, amount: number, slots: number, deadline: bigint): Promise<boolean>;
  save(clock: WorldResourceNewClock): Promise<void>;
}
export interface WorldResourceNewExecutor {
  execute(
    now: bigint | undefined,
    work: (store: WorldResourceNewStore) => Promise<void>,
  ): Promise<void>;
}
