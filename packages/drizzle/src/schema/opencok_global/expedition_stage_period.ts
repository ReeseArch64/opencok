import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const expedition_stage_period = opencok_global.table(
  "expedition_stage_period",
  {
    periodId: varchar("periodId", { length: 40 }).notNull(),
    stage: integer("stage").notNull(),
    leader: integer("leader").notNull(),
    opponent: integer("opponent").notNull(),
    startTime: bigint("startTime", { mode: "bigint" }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    state: integer("state").notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    finalizedAt: bigint("finalizedAt", { mode: "bigint" }).notNull(),
    winner: integer("winner").notNull(),
    ranking: text("ranking"),
  },
  (table) => [
    primaryKey({
      name: "expedition_stage_period_PRIMARY",
      columns: [table.periodId, table.stage, table.leader],
    }),
    index("expedition_stage_period_pending").on(table.state, table.endTime),
    check(
      "expedition_stage_period_bounds",
      sql.raw(
        '"stage" BETWEEN 2 AND 8 AND "leader">0 AND "opponent">"leader" AND "startTime">=0 AND "endTime">"startTime" AND "createdAt">="endTime" AND "state" IN (0,1) AND "finalizedAt">=0 AND ("winner"=0 OR "winner" IN ("leader","opponent"))',
      ),
    ),
  ],
);
