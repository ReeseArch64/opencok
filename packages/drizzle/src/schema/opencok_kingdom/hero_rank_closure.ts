import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";
export const hero_rank_closure = opencok_kingdom.table(
  "hero_rank_closure",
  {
    periodId: varchar("periodId", { length: 32 }).notNull(),
    actId: varchar("actId", { length: 40 }),
    type: integer("type").notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    group: varchar("group", { length: 255 }).notNull(),
    eventId: varchar("eventId", { length: 200 }).notNull(),
    eligible: integer("eligible").notNull(),
    phase: integer("phase").notNull().default(sql.raw("0")),
    cursor: varchar("cursor", { length: 40 }).notNull().default(sql.raw("''")),
    processed: bigint("processed", { mode: "bigint" }).notNull().default(sql.raw("0")),
    scoreCount: bigint("scoreCount", { mode: "bigint" }).notNull(),
    digest: varchar("digest", { length: 32 }).notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    kingdomRank: varchar("kingdomRank", { length: 255 }),
    awardCursor: varchar("awardCursor", { length: 40 }).notNull().default(sql.raw("''")),
  },
  (table) => [
    primaryKey({ name: "hero_rank_closure_PRIMARY", columns: [table.periodId] }),
    index("hero_rank_closure_pending").on(table.phase, table.endTime),
    check(
      "hero_rank_closure_bounds",
      sql.raw(
        '"type" BETWEEN 1 AND 4 AND "endTime" > 0 AND "createdAt" >= "endTime" AND "eligible" IN (0,1) AND "phase" BETWEEN 0 AND 3 AND "processed" >= 0 AND "processed" <= "scoreCount" AND "scoreCount" <= 1000000 AND ("actId" IS NOT NULL OR ("eligible" = 0 AND "scoreCount" = 0))',
      ),
    ),
  ],
);
