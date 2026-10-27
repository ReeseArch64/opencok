import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const continued_cost_fact = opencok_kingdom.table(
  "continued_cost_fact",
  {
    ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
    requestId: varchar("requestId", { length: 128 }).notNull(),
    eventId: varchar("eventId", { length: 40 }).notNull(),
    periodId: varchar("periodId", { length: 32 }).notNull(),
    at: bigint("at", { mode: "bigint" }).notNull(),
    amount: bigint("amount", { mode: "bigint" }).notNull(),
    paid: bigint("paid", { mode: "bigint" }).notNull(),
    free: bigint("free", { mode: "bigint" }).notNull(),
    digest: varchar("digest", { length: 64 }).notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    counted: integer("counted").notNull(),
  },
  (table) => [
    primaryKey({
      name: "continued_cost_fact_PRIMARY",
      columns: [table.ownerUid, table.requestId, table.eventId],
    }),
    index("continued_cost_fact_period").on(table.periodId, table.ownerUid),
    check(
      "continued_cost_fact_bounds",
      sql.raw(
        '"at">0 AND "amount">0 AND "paid">=0 AND "free">=0 AND "createdAt">=0 AND "counted" IN (0,1)',
      ),
    ),
  ],
);
