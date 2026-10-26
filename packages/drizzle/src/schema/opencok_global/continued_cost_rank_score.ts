import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";
export const continued_cost_rank_score = opencok_global.table(
  "continued_cost_rank_score",
  {
    periodId: varchar("periodId", { length: 32 }).notNull(),
    uid: varchar("uid", { length: 40 }).notNull(),
    kingdomId: integer("kingdomId").notNull(),
    score: bigint("score", { mode: "bigint" }).notNull(),
    paid: bigint("paid", { mode: "bigint" }).notNull(),
    free: bigint("free", { mode: "bigint" }).notNull(),
    lastAt: bigint("lastAt", { mode: "bigint" }).notNull(),
    metadata: text("metadata").notNull(),
    ownerEpoch: bigint("ownerEpoch", { mode: "bigint" }).notNull(),
    sequence: bigint("sequence", { mode: "bigint" }).notNull(),
    observedAt: bigint("observedAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "continued_cost_rank_score_PRIMARY", columns: [table.periodId, table.uid] }),
    index("continued_cost_rank_score_realm").on(table.kingdomId, table.periodId),
    check(
      "continued_cost_rank_score_bounds",
      sql.raw(
        '"kingdomId">0 AND "score">0 AND "paid">=0 AND "free">=0 AND "lastAt">0 AND "ownerEpoch">0 AND "sequence">0 AND "observedAt">=0 AND octet_length("metadata")<=8192',
      ),
    ),
  ],
);
