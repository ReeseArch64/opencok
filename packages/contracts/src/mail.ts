import type { Row } from "./rows.ts";

export type MailSaveMode = "save" | "cancel" | "batch";

export interface MailSaveQuery {
  mode: MailSaveMode;
  ids: readonly string[];
  flag: 0 | 1;
  now: number;
}

export type MailSaveResult = "save" | "cancel" | "unchanged";

export interface MailSaveSnapshot {
  profile: Row | undefined;
  result: MailSaveResult;
}

export interface MailStatusQuery {
  category: number | undefined;
  now: number;
}

export interface MailStatusCount {
  type: number;
  status: number;
  allianceNotice: boolean;
  count: bigint;
}

export interface MailStatusSnapshot {
  profile: Row | undefined;
  counts: readonly MailStatusCount[];
}

export type MailStatusResult =
  | { mode: "all"; categories: { total: number; unread: number }[] }
  | { mode: "category"; total: bigint; unread: bigint }
  | { mode: "unknown" };
