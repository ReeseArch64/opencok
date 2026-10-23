import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const activity_cost_log = cokdb1.table("activity_cost_log", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "userId": varchar("userId", { length: 40 }),
  "type": integer("type"),
  "total": bigint("total", { mode: "bigint" }),
  "lv": integer("lv"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "activity_cost_log_PRIMARY", columns: [table["uid"]] }),
]);
