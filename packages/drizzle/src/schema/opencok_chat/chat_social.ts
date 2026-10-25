import { sql } from "drizzle-orm";
import {
  bigint,
  bigserial,
  check,
  index,
  integer,
  jsonb,
  primaryKey,
  text,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_chat } from "../namespaces";

export const chat_operation = opencok_chat.table(
  "chat_operation",
  {
    owner: varchar("owner", { length: 40 }).notNull(),
    operationId: varchar("operation_id", { length: 128 }).notNull(),
    command: varchar("command", { length: 80 }).notNull(),
    hash: varchar("hash", { length: 64 }).notNull(),
    response: bytea("response").notNull(),
    createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.owner, table.operationId] })],
);
export const chat_relation = opencok_chat.table(
  "chat_relation",
  {
    owner: varchar("owner", { length: 40 }).notNull(),
    other: varchar("other", { length: 40 }).notNull(),
    kind: varchar("kind", { length: 16 }).notNull(),
    state: integer("state").notNull().default(0),
    description: text("description").notNull().default(""),
    id: varchar("id", { length: 40 }).notNull().default(""),
    facebookId: varchar("facebook_id", { length: 80 }),
    facebookName: varchar("facebook_name", { length: 100 }),
    createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.owner, table.other, table.kind] }),
    index("chat_relation_other").on(table.other, table.kind),
    check("chat_relation_kind", sql`${table.kind} in ('contact','block','facebook')`),
  ],
);
export const chat_social_import = opencok_chat.table("chat_social_import", {
  owner: varchar("owner", { length: 40 }).primaryKey(),
  realm: integer("realm").notNull(),
  createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
});
export const chat_private_room = opencok_chat.table("chat_private_room", {
  id: varchar("id", { length: 40 }).primaryKey(),
  owner: varchar("owner", { length: 40 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  version: integer("version").notNull().default(1),
  createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
  deletedAt: bigint("deleted_at", { mode: "bigint" }),
});
export const chat_private_member = opencok_chat.table(
  "chat_private_member",
  {
    room: varchar("room", { length: 40 }).notNull(),
    owner: varchar("owner", { length: 40 }).notNull(),
    role: integer("role").notNull(),
    joinedAt: bigint("joined_at", { mode: "bigint" }).notNull(),
    leftAt: bigint("left_at", { mode: "bigint" }),
    readSequence: bigint("read_sequence", { mode: "bigint" })
      .notNull()
      .default(sql`0`),
  },
  (table) => [
    primaryKey({ columns: [table.room, table.owner] }),
    index("chat_private_member_owner").on(table.owner, table.leftAt),
  ],
);
export const chat_moderation = opencok_chat.table("chat_moderation", {
  owner: varchar("owner", { length: 40 }).primaryKey(),
  muteUntil: bigint("mute_until", { mode: "bigint" })
    .notNull()
    .default(sql`0`),
  noticeUntil: bigint("notice_until", { mode: "bigint" })
    .notNull()
    .default(sql`0`),
  actor: varchar("actor", { length: 40 }).notNull(),
  reason: varchar("reason", { length: 500 }).notNull().default(""),
  version: integer("version").notNull().default(1),
  updatedAt: bigint("updated_at", { mode: "bigint" }).notNull(),
});
export const chat_report = opencok_chat.table(
  "chat_report",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    owner: varchar("owner", { length: 40 }).notNull(),
    target: varchar("target", { length: 40 }).notNull(),
    message: varchar("message", { length: 100 }),
    reason: varchar("reason", { length: 2000 }).notNull(),
    createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
    expiresAt: bigint("expires_at", { mode: "bigint" }).notNull(),
  },
  (table) => [index("chat_report_expiry").on(table.expiresAt)],
);
export const chat_feed = opencok_chat.table(
  "chat_feed",
  {
    id: varchar("id", { length: 100 }).primaryKey(),
    owner: varchar("owner", { length: 40 }).notNull(),
    realm: integer("realm").notNull(),
    alliance: varchar("alliance", { length: 40 }).notNull().default(""),
    parent: varchar("parent", { length: 100 }),
    type: integer("type").notNull(),
    body: jsonb("body").notNull(),
    createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
    expiresAt: bigint("expires_at", { mode: "bigint" }).notNull(),
    deletedAt: bigint("deleted_at", { mode: "bigint" }),
  },
  (table) => [
    index("chat_feed_alliance").on(table.realm, table.alliance, table.createdAt),
    index("chat_feed_owner").on(table.owner, table.createdAt),
    index("chat_feed_expiry").on(table.expiresAt),
  ],
);
export const chat_feed_notice = opencok_chat.table(
  "chat_feed_notice",
  {
    owner: varchar("owner", { length: 40 }).notNull(),
    feed: varchar("feed", { length: 100 }).notNull(),
    createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.owner, table.feed] })],
);
export const chat_event = opencok_chat.table(
  "chat_event",
  {
    sequence: bigserial("sequence", { mode: "bigint" }).primaryKey(),
    id: varchar("id", { length: 40 }).notNull().unique(),
    kind: varchar("kind", { length: 30 }).notNull(),
    room: varchar("room", { length: 160 }).notNull().default(""),
    owner: varchar("owner", { length: 40 }).notNull(),
    target: varchar("target", { length: 40 }),
    message: varchar("message", { length: 100 }),
    data: jsonb("data"),
    createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
    expiresAt: bigint("expires_at", { mode: "bigint" }).notNull(),
  },
  (table) => [index("chat_event_expiry").on(table.expiresAt)],
);
export const chat_consumer = opencok_chat.table("chat_consumer", {
  id: varchar("id", { length: 100 }).primaryKey(),
  cursor: bigint("cursor", { mode: "bigint" })
    .notNull()
    .default(sql`0`),
  token: varchar("token", { length: 40 }).notNull(),
  leaseUntil: bigint("lease_until", { mode: "bigint" }).notNull(),
  updatedAt: bigint("updated_at", { mode: "bigint" }).notNull(),
});

export const chat_mailbox_intent = opencok_chat.table(
  "chat_mailbox_intent",
  {
    realm: integer("realm").notNull(),
    owner: varchar("owner", { length: 40 }).notNull(),
    operation: varchar("operation", { length: 40 }).notNull(),
    effect: integer("effect").notNull(),
    peer: varchar("peer", { length: 40 }).notNull(),
    type: integer("type").notNull(),
    action: varchar("action", { length: 10 }).notNull(),
    cutoff: bigint("cutoff", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.realm, table.operation, table.effect, table.type] }),
    index("chat_mailbox_intent_owner").on(table.realm, table.owner, table.type, table.cutoff),
  ],
);

export const chat_owner_command = opencok_chat.table(
  "chat_owner_command",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    actor: varchar("actor", { length: 40 }).notNull(),
    operation: varchar("operation", { length: 128 }).notNull(),
    owner: varchar("owner", { length: 40 }).notNull(),
    realm: integer("realm").notNull(),
    kind: varchar("kind", { length: 40 }).notNull(),
    payload: jsonb("payload").notNull(),
    createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
    expiresAt: bigint("expires_at", { mode: "bigint" }).notNull(),
    processedAt: bigint("processed_at", { mode: "bigint" }),
  },
  (table) => [
    uniqueIndex("chat_owner_command_receipt").on(table.actor, table.operation),
    index("chat_owner_command_pending").on(table.realm, table.processedAt, table.createdAt),
  ],
);
