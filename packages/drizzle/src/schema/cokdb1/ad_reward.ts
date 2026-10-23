import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const ad_reward = cokdb1.table("ad_reward", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": varchar("type", { length: 40 }).notNull(),
  "device": varchar("device", { length: 255 }),
  "time": bigint("time", { mode: "bigint" }),
  "state": integer("state"),
  "location": varchar("location", { length: 40 }),
  "dplink_type": integer("dplink_type").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "ad_reward_PRIMARY", columns: [table["uid"], table["type"], table["dplink_type"]] }),
  index("ad_reward_index_time").on(sql.raw("\"time\"")),
]);
