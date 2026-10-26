import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

export const chat_relation = opencok_chat.table(
  "chat_relation",
  {
    owner: varchar("owner", { length: 40 }).notNull(),
    other: varchar("other", { length: 40 }).notNull(),
    kind: varchar("kind", { length: 16 }).notNull(),
    state: integer("state")
      .notNull()
      .default(sql`0`),
    description: text("description")
      .notNull()
      .default(sql`''`),
    id: varchar("id", { length: 40 })
      .notNull()
      .default(sql`''`),
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
