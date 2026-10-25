import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const game_identity = opencok_global.table(
  "game_identity",
  {
    id: varchar("id", { length: 40 }).notNull(),
    issuer: varchar("issuer", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 128 }).notNull(),
    disabled: integer("disabled")
      .notNull()
      .default(sql`0`),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "game_identity_PRIMARY", columns: [table.id] }),
    uniqueIndex("game_identity_provider").on(table.issuer, table.subject),
  ],
);
