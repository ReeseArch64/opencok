import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_resource_log = opencok_kingdom.table(
  "user_resource_log",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "day": varchar("day", { length: 10 }).notNull(),
    "resourceType": integer("resourceType").notNull(),
    "actionType": integer("actionType").notNull(),
    "rewardType": integer("rewardType").notNull(),
    "count": bigint("count", { mode: "bigint" }).default(sql.raw("0")),
    "times": integer("times").default(sql.raw("0")),
    "updateTime": bigint("updateTime", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({
      name: "user_resource_log_PRIMARY",
      columns: [
        table["uid"],
        table["day"],
        table["resourceType"],
        table["actionType"],
        table["rewardType"],
      ],
    }),
  ],
);
