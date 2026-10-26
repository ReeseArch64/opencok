import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";
export const expedition_stage_award = opencok_kingdom.table(
  "expedition_stage_award",
  {
    id: varchar("id", { length: 32 }).notNull(),
    periodId: varchar("periodId", { length: 40 }).notNull(),
    stage: integer("stage").notNull(),
    ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
    payload: text("payload").notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    deliveredAt: bigint("deliveredAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
    nextAttemptAt: bigint("nextAttemptAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "expedition_stage_award_PRIMARY", columns: [table.id] }),
    index("expedition_stage_award_pending").on(
      table.deliveredAt,
      table.nextAttemptAt,
      table.createdAt,
    ),
    check(
      "expedition_stage_award_bounds",
      sql.raw(
        '"stage" BETWEEN 2 AND 8 AND "createdAt">=0 AND "deliveredAt">=0 AND "nextAttemptAt">=0 AND octet_length("payload") BETWEEN 1 AND 1048576',
      ),
    ),
  ],
);
