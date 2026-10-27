import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar, check } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_arena_army = opencok_kingdom.table(
  "user_arena_army",
  {
    uid: varchar("uid", { length: 40 }).notNull(),
    armyId: varchar("armyId", { length: 40 }).notNull(),
    free: integer("free").notNull(),
  },
  (table) => [
    primaryKey({ name: "user_arena_army_PRIMARY", columns: [table.uid, table.armyId] }),
    check("user_arena_army_quantity", sql`"free" >= 0`),
  ],
);
