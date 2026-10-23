import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const lottery_log = opencok_kingdom.table("lottery_log", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "name": varchar("name", { length: 200 }),
  "type": smallint("type"),
  "superMode": smallint("superMode"),
  "lotteryId": varchar("lotteryId", { length: 40 }),
  "lotteryInfo": varchar("lotteryInfo", { length: 200 }),
  "result": varchar("result", { length: 100 }),
  "position": integer("position"),
  "cost": integer("cost"),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "lottery_log_PRIMARY", columns: [table["uid"], table["createTime"]] }),
  check("lottery_log_type_range", sql.raw("\"type\" BETWEEN -128 AND 127")),
  check("lottery_log_superMode_range", sql.raw("\"superMode\" BETWEEN -128 AND 127")),
]);
