import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";
export const hero_rank_score = opencok_global.table(
  "hero_rank_score",
  {
    rankKey: varchar("rankKey", { length: 400 }).notNull(),
    member: varchar("member", { length: 40 }).notNull(),
    kingdomId: integer("kingdomId").notNull(),
    actId: varchar("actId", { length: 40 }).notNull(),
    eventId: varchar("eventId", { length: 200 }).notNull(),
    type: integer("type").notNull(),
    level: integer("level").notNull(),
    endTime: bigint("endTime", { mode: "bigint" }).notNull(),
    score: integer("score").notNull(),
    metadata: text("metadata"),
    ownerEpoch: bigint("ownerEpoch", { mode: "bigint" }).notNull(),
    sequence: bigint("sequence", { mode: "bigint" }).notNull(),
    observedAt: bigint("observedAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "hero_rank_score_PRIMARY", columns: [table.rankKey, table.member] }),
    index("hero_rank_score_period").on(table.endTime, table.kingdomId, table.rankKey, table.member),
    check(
      "hero_rank_score_bounds",
      sql.raw(
        '"kingdomId" > 0 AND "type" BETWEEN 1 AND 4 AND "level" BETWEEN 0 AND 4095 AND "endTime" > 0 AND "ownerEpoch" > 0 AND "sequence" > 0 AND "observedAt" >= 0 AND ("metadata" IS NULL OR octet_length("metadata") <= 8192)',
      ),
    ),
  ],
);
