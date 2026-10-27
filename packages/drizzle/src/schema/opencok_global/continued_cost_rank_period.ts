import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const continued_cost_rank_period = opencok_global.table(
  "continued_cost_rank_period",
  {
    id: varchar("id", { length: 32 }).notNull(),
    startTime: bigint("startTime", { mode: "bigint" }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    type: integer("type").notNull(),
    rewards: text("rewards").notNull(),
    expectedRealms: varchar("expectedRealms", { length: 2048 }).notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    state: integer("state").notNull().default(sql.raw("0")),
    finalizedAt: bigint("finalizedAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
    revision: bigint("revision", { mode: "bigint" }).notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "continued_cost_rank_period_PRIMARY", columns: [table.id] }),
    index("continued_cost_rank_period_end").on(table.endTime),
    check(
      "continued_cost_rank_period_bounds",
      sql.raw(
        '"startTime">0 AND "endTime">"startTime" AND "type" BETWEEN 1 AND 6 AND "createdAt">=0 AND "state" IN (0,1) AND "finalizedAt">=0 AND "revision">=0 AND octet_length("rewards")<=8192',
      ),
    ),
  ],
);
