import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";
export const vip_box_history = opencok_kingdom.table(
  "vip_box_history",
  {
    id: varchar("id", { length: 40 }).notNull(),
    uid: varchar("uid", { length: 40 }).notNull(),
    name: varchar("name", { length: 40 }).notNull(),
    itemId: varchar("itemId", { length: 40 }).notNull(),
    count: integer("count").notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "vip_box_history_PRIMARY", columns: [table.id] }),
    index("vip_box_history_recent").on(table.createdAt, table.id),
    check("vip_box_history_bounds", sql.raw('"count" > 0 AND "createdAt" >= 0')),
  ],
);
