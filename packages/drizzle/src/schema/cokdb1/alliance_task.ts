import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_task = cokdb1.table("alliance_task", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "taskId": varchar("taskId", { length: 255 }).notNull(),
  "allianceId": varchar("allianceId", { length: 255 }).notNull(),
  "publishUid": varchar("publishUid", { length: 255 }).notNull(),
  "acceptUid": varchar("acceptUid", { length: 255 }),
  "vanishTime": bigint("vanishTime", { mode: "bigint" }),
  "finishTime": bigint("finishTime", { mode: "bigint" }),
  "publishStat": integer("publishStat").default(sql.raw("0")),
  "acceptStat": integer("acceptStat"),
  "acceptReward": varchar("acceptReward", { length: 255 }),
  "baseReward": varchar("baseReward", { length: 255 }),
  "extraReward": varchar("extraReward", { length: 255 }),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "publishTime": bigint("publishTime", { mode: "bigint" }).default(sql.raw("0")),
  "freequeue": integer("freequeue").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_task_PRIMARY", columns: [table["uid"]] }),
  index("alliance_task_al_idx").on(sql.raw("\"allianceId\"")),
  index("alliance_task_publish_idx").on(sql.raw("\"publishUid\"")),
  index("alliance_task_accept_idx").on(sql.raw("\"acceptUid\"")),
]);
