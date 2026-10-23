import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_task_unpublish = opencok_kingdom.table("alliance_task_unpublish", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "taskId": varchar("taskId", { length: 255 }).notNull(),
  "publishUid": varchar("publishUid", { length: 255 }).notNull(),
  "stat": integer("stat").default(sql.raw("0")),
  "vanishTime": bigint("vanishTime", { mode: "bigint" }),
  "finishTime": bigint("finishTime", { mode: "bigint" }),
  "acceptReward": varchar("acceptReward", { length: 255 }),
  "baseReward": varchar("baseReward", { length: 255 }),
  "extraReward": varchar("extraReward", { length: 255 }),
}, (table) => [
  primaryKey({ name: "alliance_task_unpublish_PRIMARY", columns: [table["uid"]] }),
  index("alliance_task_unpublish_pub_idx").on(sql.raw("\"publishUid\"")),
]);
