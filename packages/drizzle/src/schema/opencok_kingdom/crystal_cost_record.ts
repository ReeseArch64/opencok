import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const crystal_cost_record = opencok_kingdom.table("crystal_cost_record", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "userId": varchar("userId", { length: 255 }).notNull(),
  "goldType": integer("goldType"),
  "type": integer("type").notNull(),
  "param1": integer("param1"),
  "param2": integer("param2"),
  "originalGold": bigint("originalGold", { mode: "bigint" }).notNull(),
  "cost": integer("cost").notNull(),
  "remainGold": bigint("remainGold", { mode: "bigint" }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "crystal_cost_record_PRIMARY", columns: [table["uid"]] }),
  index("crystal_cost_record_index_user").on(sql.raw("\"time\""), sql.raw("\"userId\""), sql.raw("\"type\"")),
  index("crystal_cost_record_index_type").on(sql.raw("\"userId\""), sql.raw("\"time\""), sql.raw("\"type\"")),
  index("crystal_cost_record_index_goldType").on(sql.raw("\"goldType\"")),
]);
