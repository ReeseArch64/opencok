import { sql } from "drizzle-orm";
import { bigint, index, integer, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const action_record_pack = opencok_kingdom.table("action_record_pack", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "type": integer("type").notNull(),
  "type1": integer("type1"),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "powerDelta": bigint("powerDelta", { mode: "bigint" }),
  "deadDelta": integer("deadDelta").notNull().default(sql.raw("0")),
  "armyDelta": integer("armyDelta").notNull().default(sql.raw("0")),
  "item": varchar("item", { length: 40 }),
  "param": varchar("param", { length: 1024 }),
  "gold": integer("gold"),
}, (_table) => [
  index("action_record_pack_uid").on(sql.raw("\"uid\""), sql.raw("\"type\""), sql.raw("\"type1\"")),
  index("action_record_pack_time").on(sql.raw("\"time\"")),
]);
