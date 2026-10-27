import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";
export const expedition_clock = opencok_kingdom.table(
  "expedition_clock",
  {
    serverId: integer("serverId").notNull(),
    periodId: varchar("periodId", { length: 40 }).notNull(),
    stage: integer("stage").notNull(),
    startTime: bigint("startTime", { mode: "bigint" }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    opponent: integer("opponent").notNull(),
    revision: bigint("revision", { mode: "bigint" }).notNull(),
    updatedAt: bigint("updatedAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "expedition_clock_PRIMARY", columns: [table.serverId] }),
    check(
      "expedition_clock_bounds",
      sql.raw(
        '"serverId" > 0 AND "stage" BETWEEN 0 AND 8 AND "startTime" >= 0 AND "endTime" > "startTime" AND "opponent" >= 0 AND "opponent" <> "serverId" AND ("stage" < 2 OR "opponent" > 0) AND "revision" > 0 AND "updatedAt" >= 0',
      ),
    ),
  ],
);
