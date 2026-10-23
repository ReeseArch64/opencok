import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_cross_fight_history = opencok_kingdom.table("user_cross_fight_history", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }).notNull(),
  "round": integer("round").notNull(),
  "score": bigint("score", { mode: "bigint" }).default(sql.raw("0")),
  "rank": integer("rank").default(sql.raw("0")),
  "serverId": integer("serverId").notNull(),
  "worldId": integer("worldId").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_cross_fight_history_PRIMARY", columns: [table["uid"], table["startTime"], table["round"], table["worldId"]] }),
  index("user_cross_fight_history_user_startTime").on(sql.raw("\"uid\""), sql.raw("\"startTime\"")),
  index("user_cross_fight_history_startTime").on(sql.raw("\"startTime\"")),
]);
