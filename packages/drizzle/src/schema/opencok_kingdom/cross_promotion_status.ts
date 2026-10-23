import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const cross_promotion_status = opencok_kingdom.table(
  "cross_promotion_status",
  {
    "srcGameId": varchar("srcGameId", { length: 255 }).notNull(),
    "targetGameId": varchar("targetGameId", { length: 255 }).notNull(),
    "srcUid": varchar("srcUid", { length: 255 }).notNull(),
    "targetUid": varchar("targetUid", { length: 255 }).notNull(),
    "taskid": varchar("taskid", { length: 255 }).notNull(),
    "taskType": integer("taskType").notNull(),
    "startTime": bigint("startTime", { mode: "bigint" }),
    "endTime": bigint("endTime", { mode: "bigint" }),
    "curValue": integer("curValue").notNull().default(sql.raw("0")),
    "maxValue": integer("maxValue").notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({
      name: "cross_promotion_status_PRIMARY",
      columns: [table["srcGameId"], table["targetUid"], table["taskid"]],
    }),
  ],
);
