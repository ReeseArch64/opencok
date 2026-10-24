import type { Row } from "./rows.ts";

export type MailConversationSaveQuery = { now: number } & (
  | { scope: "none" }
  | { scope: "sender"; fromUser: string; moderation: boolean; flag: number }
  | { scope: "type"; type: number; flag: number }
);

export interface MailConversationSaveSnapshot {
  profile: Row | undefined;
}

export interface MailDeleteQuery {
  ids: readonly string[];
  now: number;
}

export interface MailDeleteEntry {
  uid: string;
  type: number;
  fromUser: string | null;
  contents: Buffer | null;
  extra: Buffer | null;
}

export interface MailDeleteGroup {
  groupType: number;
  groupIndex: string;
  types: readonly number[];
  fromUser?: string;
}

export interface MailDeletePlan {
  groups: readonly MailDeleteGroup[];
  inviters: readonly string[];
}

export type MailDeletePlanner = (entries: readonly MailDeleteEntry[]) => MailDeletePlan;

export interface MailDeleteSnapshot {
  profile: Row | undefined;
  deleted: number;
}

export interface MailReadQuery {
  batch: boolean;
  ids: readonly string[];
  now: number;
}

export interface MailReadSnapshot {
  profile: Row | undefined;
}

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
