import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar, check } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";
export const world_interest = opencok_kingdom.table(
  "world_interest",
  {
    ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
    worldId: integer("worldId").notNull(),
    x: integer("x").notNull(),
    y: integer("y").notNull(),
    updatedAt: bigint("updatedAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    check(
      "world_interest_bounds",
      sql`"worldId" >= 0 AND "x" >= 0 AND "y" >= 0 AND "updatedAt" >= 0`,
    ),
    primaryKey({ name: "world_interest_PRIMARY", columns: [table.ownerUid] }),
  ],
);
