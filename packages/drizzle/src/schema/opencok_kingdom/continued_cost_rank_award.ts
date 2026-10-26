import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  index,
  integer,
  primaryKey,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";
export const continued_cost_rank_award = opencok_kingdom.table(
  "continued_cost_rank_award",
  {
    id: varchar("id", { length: 32 }).notNull(),
    periodId: varchar("periodId", { length: 32 }).notNull(),
    ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
    rank: integer("rank").notNull(),
    payload: text("payload").notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    deliveredAt: bigint("deliveredAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
    nextAttemptAt: bigint("nextAttemptAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "continued_cost_rank_award_PRIMARY", columns: [table.id] }),
    uniqueIndex("continued_cost_rank_award_recipient").on(table.periodId, table.ownerUid),
    index("continued_cost_rank_award_pending").on(
      table.deliveredAt,
      table.nextAttemptAt,
      table.createdAt,
    ),
    check(
      "continued_cost_rank_award_bounds",
      sql.raw(
        '"rank" BETWEEN 1 AND 100 AND "createdAt">=0 AND "deliveredAt">=0 AND "nextAttemptAt">=0 AND octet_length("payload") BETWEEN 1 AND 65536',
      ),
    ),
  ],
);
