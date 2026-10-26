import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
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
