import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const kingdom_cross_fight_history = opencok_kingdom.table(
  "kingdom_cross_fight_history",
  {
    "serverId": varchar("serverId", { length: 10 }).notNull(),
    "startTime": bigint("startTime", { mode: "bigint" }).notNull(),
    "round": integer("round").notNull(),
    "score": bigint("score", { mode: "bigint" }).default(sql.raw("0")),
    "rank": integer("rank").default(sql.raw("0")),
  },
  (table) => [
    primaryKey({
      name: "kingdom_cross_fight_history_PRIMARY",
      columns: [table["serverId"], table["startTime"], table["round"]],
    }),
    index("kingdom_cross_fight_history_kingdom_startTime").on(
      sql.raw('"serverId"'),
      sql.raw('"startTime"'),
    ),
    index("kingdom_cross_fight_history_startTime").on(sql.raw('"startTime"')),
  ],
);
