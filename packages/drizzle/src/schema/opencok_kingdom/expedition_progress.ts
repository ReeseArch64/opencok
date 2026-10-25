import { sql } from "drizzle-orm";
import { check, doublePrecision, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const expedition_progress = opencok_kingdom.table(
  "expedition_progress",
  {
    uid: varchar("uid", { length: 40 }).notNull(),
    periodId: varchar("periodId", { length: 40 }).notNull(),
    stage: integer("stage").notNull(),
    score: doublePrecision("score").notNull().default(sql.raw("0")),
    takeReward: varchar("takeReward", { length: 500 }).notNull().default(sql.raw("''")),
  },
  (table) => [
    primaryKey({
      name: "expedition_progress_PRIMARY",
      columns: [table.uid, table.periodId, table.stage],
    }),
    check(
      "expedition_progress_bounds",
      sql.raw('"stage" BETWEEN 0 AND 8 AND "score" >= 0 AND "score" < \'Infinity\'::float8'),
    ),
  ],
);
