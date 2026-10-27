import {
  bigint,
  boolean,
  check,
  index,
  integer,
  primaryKey,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { opencok_chat } from "../namespaces";

export const chat_mailbox_message = opencok_chat.table(
  "chat_mailbox_message",
  {
    kingdom_id: integer("kingdom_id").notNull(),
    owner_uid: varchar("owner_uid", { length: 40 }).notNull(),
    message_id: varchar("message_id", { length: 100 }).notNull(),
    peer_uid: varchar("peer_uid", { length: 40 }).notNull(),
    chat_type: integer("chat_type").notNull(),
    created_at: bigint("created_at", { mode: "bigint" }).notNull(),
    body: text("body").notNull(),
    read: boolean("read").notNull().default(false),
    sender_uid: varchar("sender_uid", { length: 40 }),
    expires_at: bigint("expires_at", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({
      name: "chat_mailbox_message_kingdom_id_owner_uid_message_id_pk",
      columns: [table.kingdom_id, table.owner_uid, table.message_id],
    }),
    index("chat_mailbox_message_conversation").on(
      table.kingdom_id,
      table.owner_uid,
      table.peer_uid,
      table.chat_type,
      table.created_at,
    ),
    check("chat_mailbox_message_type", sql.raw('"chat_type" IN (1, 2, 3, 20)')),
    check(
      "chat_mailbox_message_owner",
      sql.raw('"kingdom_id" > 0 AND length("owner_uid") > 0 AND length("message_id") > 0'),
    ),
  ],
);
