import type { Row } from "./rows.ts";

export interface MailGroupQuery {
  moderation: boolean;
  begin: number;
  limit: number;
  now: number;
}

export interface MailGroupKey {
  groupType: number;
  groupIndex: string;
}

export interface MailGroupEntry extends MailGroupKey {
  uid: string;
  updateTime: bigint;
}

export interface MailGroupPreview {
  total: bigint;
  unread: bigint;
  entries: readonly MailListEntry[];
}

export interface MailGroupPage {
  groups: readonly MailGroupEntry[];
  previews: readonly MailGroupPreview[];
}

export interface MailGroupCleanup {
  groups: readonly MailGroupKey[];
  mailIds: readonly string[];
}

export interface MailGroupSelection {
  kind: "sender" | "type" | "uid";
  types: readonly number[];
}

export interface MailGroupReaders extends MailCategoryReaders {
  preview(group: MailGroupKey, selection: MailGroupSelection): Promise<MailGroupPreview>;
}

export type MailGroupInspector = (
  groups: readonly MailGroupEntry[],
  readers: MailGroupReaders,
) => Promise<MailGroupCleanup>;

export type MailBatchKind =
  | "notices"
  | "studio"
  | "personal"
  | "resources"
  | "fight"
  | "monsters"
  | "trade"
  | "moderation"
  | "boss"
  | "empty";

export interface MailBatchQuery {
  kind: MailBatchKind;
  begin: number;
  limit: number;
  fromUser: string | null;
  now: number;
}

export interface MailCategoryQuery {
  category: number;
  begin: number;
  offset: number;
  now: number;
}

export interface MailTranslationLookup {
  id: string;
  language: string;
}

export interface MailCategoryReaders {
  senders(uids: readonly string[]): Promise<ReadonlyMap<string, MailSender>>;
  translations(
    requests: readonly MailTranslationLookup[],
  ): Promise<readonly (MailTranslationLookup & { contents: Buffer | null })[]>;
}

export type MailCategoryInspector = (
  entries: readonly MailListEntry[],
  readers: MailCategoryReaders,
) => Promise<readonly string[]>;

export interface MailCategorySnapshot {
  profile: Row | undefined;
}

export interface MailListEntry extends MailContentsEntry {
  toUser: string;
  fromUser: string | null;
  fromName: string | null;
  title: string | null;
  rewardId: string | null;
  rewardStatus: number;
  status: number | null;
  itemIdFlag: number | null;
  saveFlag: number | null;
  reply: number;
  translationId: string | null;
}

export interface MailSender {
  name: string | null;
  pic: string | null;
  picVer?: string;
  abbr?: string | null;
  lang: string | null;
}

export interface MailTranslation {
  originalLang: string;
  translationMsg: string;
}

export interface MailCategoryPresentation {
  senders: ReadonlyMap<string, MailSender>;
  recipientUpdateTime: string;
  translations: ReadonlyMap<string, MailTranslation>;
  translationEnabled: boolean;
}

export interface MailContentsQuery {
  ids: readonly string[];
  now: number;
}

export interface MailContentsEntry {
  uid: string;
  type: number;
  createTime: bigint;
  contents: Buffer | null;
  extra: Buffer | null;
}

export type MailContentsInspector = (entries: readonly MailContentsEntry[]) => readonly string[];

export interface MailContentsSnapshot {
  profile: Row | undefined;
}

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
