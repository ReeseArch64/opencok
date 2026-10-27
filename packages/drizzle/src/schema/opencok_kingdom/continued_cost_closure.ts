import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const continued_cost_closure = opencok_kingdom.table(
  "continued_cost_closure",
  {
    periodId: varchar("periodId", { length: 32 }).notNull(),
    snapshot: text("snapshot").notNull(),
    digest: varchar("digest", { length: 64 }).notNull(),
    scoreCount: integer("scoreCount").notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    phase: integer("phase").notNull().default(sql.raw("0")),
    finalizedAt: bigint("finalizedAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
    awardCursor: integer("awardCursor").notNull().default(sql.raw("0")),
    awardedAt: bigint("awardedAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "continued_cost_closure_PRIMARY", columns: [table.periodId] }),
    check(
      "continued_cost_closure_awards",
      sql.raw('"awardCursor" BETWEEN 0 AND 100 AND "awardedAt">=0'),
    ),
    check(
      "continued_cost_closure_bounds",
      sql.raw(
        '"scoreCount" BETWEEN 0 AND 100 AND "createdAt">=0 AND "phase" BETWEEN 0 AND 2 AND "finalizedAt">=0 AND octet_length("snapshot")<=1048576',
      ),
    ),
  ],
);
