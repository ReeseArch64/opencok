import type { Row } from "./rows.ts";

export interface MailUpdateQuery {
  after: bigint;
  now: number;
}

export interface MailUpdateEntry {
  uid: string;
  updateTime: bigint;
  flags: { status: number; rewardStatus: number; saveFlag: number } | null;
}

export type MailUpdateInspector = (entries: readonly MailUpdateEntry[]) => void | Promise<void>;

export interface MailUpdateSnapshot {
  profile: Row | undefined;
}
