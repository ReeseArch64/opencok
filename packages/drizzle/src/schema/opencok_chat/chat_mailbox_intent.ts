import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

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
