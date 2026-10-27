import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  doublePrecision,
  index,
  integer,
  primaryKey,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";
export const expedition_score = opencok_global.table(
  "expedition_score",
  {
    periodId: varchar("periodId", { length: 40 }).notNull(),
    stage: integer("stage").notNull(),
    member: varchar("member", { length: 40 }).notNull(),
    kingdomId: integer("kingdomId").notNull(),
    opponent: integer("opponent").notNull(),
    allianceId: varchar("allianceId", { length: 40 }).notNull(),
    score: doublePrecision("score").notNull(),
    metadata: text("metadata"),
    ownerEpoch: bigint("ownerEpoch", { mode: "bigint" }).notNull(),
    sequence: bigint("sequence", { mode: "bigint" }).notNull(),
    observedAt: bigint("observedAt", { mode: "bigint" }).notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "expedition_score_PRIMARY",
      columns: [table.periodId, table.stage, table.member],
    }),
    index("expedition_score_end").on(table.endTime),
    index("expedition_score_realm").on(table.kingdomId, table.periodId, table.stage),
    check(
      "expedition_score_bounds",
      sql.raw(
        '"stage" BETWEEN 0 AND 8 AND "kingdomId" > 0 AND "opponent" > 0 AND "opponent" <> "kingdomId" AND "score" >= 0 AND "score" < \'Infinity\'::double precision AND "ownerEpoch" > 0 AND "sequence" > 0 AND "observedAt" >= 0 AND "endTime" > 0 AND ("metadata" IS NULL OR octet_length("metadata") <= 8192)',
      ),
    ),
  ],
);
