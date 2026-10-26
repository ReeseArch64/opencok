import { sql } from "drizzle-orm";
import { bigint, index, integer, real, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const soccer_match = opencok_kingdom.table(
  "soccer_match",
  {
    "id": varchar("id", { length: 255 }).notNull(),
    "vs": varchar("vs", { length: 100 }),
    "idx": integer("idx"),
    "winner": varchar("winner", { length: 100 }),
    "startBetTime": bigint("startBetTime", { mode: "bigint" }),
    "startTime": bigint("startTime", { mode: "bigint" }),
    "ended": integer("ended"),
    "betNumA": bigint("betNumA", { mode: "bigint" }),
    "betNumB": bigint("betNumB", { mode: "bigint" }),
    "oddsA": real("oddsA"),
    "oddsB": real("oddsB"),
  },
  (table) => [
    primaryKey({ name: "soccer_match_PRIMARY", columns: [table["id"]] }),
    index("soccer_match_idx_sbt").on(sql.raw('"startBetTime"')),
    index("soccer_match_idx_st").on(sql.raw('"startTime"')),
  ],
);
