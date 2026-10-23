import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_monster_siege_top_history = opencok_kingdom.table("user_monster_siege_top_history", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "name": varchar("name", { length: 40 }).notNull(),
  "allianceAbbr": varchar("allianceAbbr", { length: 40 }),
  "allianceName": varchar("allianceName", { length: 40 }),
  "rank": integer("rank").notNull(),
  "killCount": bigint("killCount", { mode: "bigint" }).default(sql.raw("0")),
  "failRounds": varchar("failRounds", { length: 100 }),
}, (table) => [
  primaryKey({ name: "user_monster_siege_top_history_PRIMARY", columns: [table["uid"], table["time"]] }),
]);
