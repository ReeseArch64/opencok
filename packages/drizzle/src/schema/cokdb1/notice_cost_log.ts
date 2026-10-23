import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const notice_cost_log = cokdb1.table("notice_cost_log", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": smallint("type"),
  "itemId": varchar("itemId", { length: 20 }).notNull(),
  "cost": integer("cost"),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "notice_cost_log_PRIMARY", columns: [table["uid"], table["itemId"], table["createTime"]] }),
  check("notice_cost_log_type_range", sql.raw("\"type\" BETWEEN -128 AND 127")),
]);
