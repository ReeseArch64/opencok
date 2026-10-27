import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";
export const hero_rank_period = opencok_global.table(
  "hero_rank_period",
  {
    id: varchar("id", { length: 32 }).notNull(),
    type: integer("type").notNull(),
    eventId: varchar("eventId", { length: 200 }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    group: varchar("group", { length: 255 }).notNull(),
    expectedRealms: varchar("expectedRealms", { length: 2048 }).notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    state: integer("state").notNull().default(sql.raw("0")),
    finalizedAt: bigint("finalizedAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
    kingdomRank: varchar("kingdomRank", { length: 255 }),
  },
  (table) => [
    primaryKey({ name: "hero_rank_period_PRIMARY", columns: [table.id] }),
    index("hero_rank_period_pending").on(table.state, table.endTime),
    check(
      "hero_rank_period_bounds",
      sql.raw(
        '"type" BETWEEN 1 AND 4 AND "endTime" > 0 AND "createdAt" >= "endTime" AND "state" IN (0,1) AND (("state" = 0 AND "finalizedAt" = 0) OR ("state" = 1 AND "finalizedAt" >= "endTime"))',
      ),
    ),
  ],
);
