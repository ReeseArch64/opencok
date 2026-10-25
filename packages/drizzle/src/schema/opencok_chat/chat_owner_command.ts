import { bigint, index, integer, jsonb, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

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
