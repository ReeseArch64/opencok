import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  doublePrecision,
  index,
  integer,
  primaryKey,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const expedition_stage_closure = opencok_kingdom.table(
  "expedition_stage_closure",
  {
    periodId: varchar("periodId", { length: 40 }).notNull(),
    stage: integer("stage").notNull(),
    opponent: integer("opponent").notNull(),
    startTime: bigint("startTime", { mode: "bigint" }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    phase: integer("phase").notNull(),
    cursor: varchar("cursor", { length: 40 }).notNull(),
    processed: bigint("processed", { mode: "bigint" }).notNull(),
    scoreCount: bigint("scoreCount", { mode: "bigint" }).notNull(),
    digest: varchar("digest", { length: 32 }).notNull(),
    total: doublePrecision("total").notNull(),
    createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
    winner: integer("winner").notNull(),
    finalizedAt: bigint("finalizedAt", { mode: "bigint" }).notNull(),
    awardCursor: varchar("awardCursor", { length: 40 }).notNull().default(sql.raw("''")),
    history: text("history"),
  },
  (table) => [
    primaryKey({
      name: "expedition_stage_closure_PRIMARY",
      columns: [table.periodId, table.stage],
    }),
    index("expedition_stage_closure_pending").on(table.phase, table.endTime),
    check(
      "expedition_stage_closure_bounds",
      sql.raw(
        '"stage" BETWEEN 2 AND 8 AND "opponent">0 AND "startTime">=0 AND "endTime">"startTime" AND "createdAt">="endTime" AND "phase" BETWEEN 0 AND 3 AND "processed">=0 AND "processed"<="scoreCount" AND "scoreCount"<=1000000 AND "total">=0 AND "total"<\'Infinity\'::double precision AND "winner">=0 AND "finalizedAt">=0',
      ),
    ),
  ],
);
