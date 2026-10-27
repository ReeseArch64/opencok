import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const hero_match_period = opencok_global.table(
  "hero_match_period",
  {
    id: varchar("id", { length: 32 }).notNull(),
    definition: varchar("definition", { length: 100 }).notNull(),
    startTime: bigint("startTime", { mode: "bigint" }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    admissionEnd: bigint("admissionEnd", { mode: "bigint" }).notNull(),
    groupSize: integer("groupSize").notNull(),
    matchSize: integer("matchSize").notNull(),
    matchedAt: bigint("matchedAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "hero_match_period_PRIMARY", columns: [table.id] }),
    check(
      "hero_match_period_bounds",
      sql.raw(
        '"startTime" >= 0 AND "createdAt" >= "startTime" AND "admissionEnd" > "createdAt" AND "endTime" > "admissionEnd" AND "groupSize" BETWEEN 1 AND 128 AND "matchSize" BETWEEN 1 AND 16 AND "matchSize" <= "groupSize" AND ("matchedAt" = 0 OR ("matchedAt" >= "admissionEnd" AND "matchedAt" < "endTime"))',
      ),
    ),
  ],
);
