import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const cross_promotion_update_task = opencok_kingdom.table("cross_promotion_update_task", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "taskid": varchar("taskid", { length: 255 }).notNull(),
  "taskType": integer("taskType").notNull(),
  "curValue": integer("curValue").notNull().default(sql.raw("0")),
  "getRewardSign": integer("getRewardSign").notNull().default(sql.raw("0")),
  "acceptTime": bigint("acceptTime", { mode: "bigint" }),
  "finishTime": bigint("finishTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "cross_promotion_update_task_PRIMARY", columns: [table["uid"], table["taskid"]] }),
]);
