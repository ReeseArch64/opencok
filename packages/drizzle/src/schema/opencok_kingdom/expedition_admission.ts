import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const expedition_admission = opencok_kingdom.table(
  "expedition_admission",
  {
    periodId: varchar("periodId", { length: 32 }).notNull(),
    startTime: bigint("startTime", { mode: "bigint" }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    activityEnd: bigint("activityEnd", { mode: "bigint" }).notNull(),
    statistics: text("statistics").notNull(),
    previousMatch: integer("previousMatch").notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    appliedAt: bigint("appliedAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "expedition_admission_PRIMARY", columns: [table.periodId] }),
    index("expedition_admission_pending").on(table.appliedAt, table.activityEnd),
    check(
      "expedition_admission_bounds",
      sql.raw(
        '"startTime" >= 0 AND "endTime" > "startTime" AND "activityEnd" > "endTime" AND "previousMatch" >= 0 AND "createdAt" >= "startTime" AND "createdAt" < "endTime" AND ("appliedAt" = 0 OR "appliedAt" >= "endTime") AND octet_length("statistics") BETWEEN 1 AND 8192',
      ),
    ),
  ],
);
