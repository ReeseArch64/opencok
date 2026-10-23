import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_new_recall_task = cokdb1.table("user_new_recall_task", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "taskId": varchar("taskId", { length: 255 }).notNull().default(sql.raw("''")),
  "day": integer("day"),
  "state": integer("state"),
  "targetNum": integer("targetNum"),
  "num": integer("num"),
  "time": bigint("time", { mode: "bigint" }),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_new_recall_task_PRIMARY", columns: [table["uid"], table["taskId"]] }),
]);
