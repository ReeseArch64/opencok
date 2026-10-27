import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const continued_cost_score = opencok_kingdom.table(
  "continued_cost_score",
  {
    periodId: varchar("periodId", { length: 32 }).notNull(),
    uid: varchar("uid", { length: 40 }).notNull(),
    total: bigint("total", { mode: "bigint" }).notNull(),
    paid: bigint("paid", { mode: "bigint" }).notNull(),
    free: bigint("free", { mode: "bigint" }).notNull(),
    lastAt: bigint("lastAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "continued_cost_score_PRIMARY", columns: [table.periodId, table.uid] }),
    check(
      "continued_cost_score_bounds",
      sql.raw('"total">0 AND "paid">=0 AND "free">=0 AND "lastAt">0'),
    ),
  ],
);
