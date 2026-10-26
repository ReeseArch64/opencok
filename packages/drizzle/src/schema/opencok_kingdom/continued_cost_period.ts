import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";
export const continued_cost_period = opencok_kingdom.table(
  "continued_cost_period",
  {
    id: varchar("id", { length: 32 }).notNull(),
    startTime: bigint("startTime", { mode: "bigint" }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    type: integer("type").notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    state: integer("state").notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "continued_cost_period_PRIMARY", columns: [table.id] }),
    index("continued_cost_period_end").on(table.endTime),
    check(
      "continued_cost_period_bounds",
      sql.raw(
        '"startTime">0 AND "endTime">"startTime" AND "type" BETWEEN 1 AND 6 AND "createdAt">=0 AND "state" IN (0,1)',
      ),
    ),
  ],
);
