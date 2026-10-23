import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const dragon_battle_fight_history = cokdb1.table("dragon_battle_fight_history", {
  "uid": varchar("uid", { length: 50 }).notNull(),
  "teamId": varchar("teamId", { length: 50 }),
  "type": integer("type").notNull(),
  "time": bigint("time", { mode: "bigint" }),
  "serverId": integer("serverId"),
  "VERSION": varchar("VERSION", { length: 50 }).default(sql.raw("''")),
  "indexId": integer("indexId"),
  "score": integer("score"),
  "id": varchar("id", { length: 50 }).notNull(),
  "param1": varchar("param1", { length: 255 }).default(sql.raw("''")),
  "seasonVersion": integer("seasonVersion").notNull().default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "dragon_battle_fight_history_PRIMARY", columns: [table["id"]] }),
  index("dragon_battle_fight_history_utvindex").on(sql.raw("\"uid\""), sql.raw("\"type\""), sql.raw("\"VERSION\"")),
  index("dragon_battle_fight_history_teamIdindex").on(sql.raw("\"teamId\"")),
]);
