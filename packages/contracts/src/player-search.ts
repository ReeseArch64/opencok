import type { Row } from "./rows.ts";

export interface PlayerSearchQuery {
  key: string;
  page: number;
  cross: boolean;
  kingdomId: number;
  minimumLevel: number;
  maximum: number;
  limit: number;
}

export interface PlayerSearchRemote {
  key: string;
  kingdomId: number;
  data: Row;
}

export interface PlayerSearchEntry {
  kingdomId: number;
  remote: boolean;
  data: Row;
}

export interface PlayerSearchResult {
  key: string;
  page: number;
  total: bigint;
  maximum: bigint;
  entries: PlayerSearchEntry[];
}

export interface PlayerSearchBudget {
  limit: number;
  minimumLevel: number;
}

export interface PlayerSearchSnapshot {
  profile: Row | undefined;
  local: Row[];
  remote: PlayerSearchRemote[];
}

export interface PlayerSearchStore {
  search(
    owner: string,
    query: PlayerSearchQuery,
    now: number,
    budget: (rows: readonly Row[]) => PlayerSearchBudget,
  ): Promise<PlayerSearchSnapshot>;
}
