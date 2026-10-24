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
