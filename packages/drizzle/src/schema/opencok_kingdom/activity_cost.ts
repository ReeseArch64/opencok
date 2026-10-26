import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const activity_cost = opencok_kingdom.table(
  "activity_cost",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "type": integer("type").notNull(),
    "total": bigint("total", { mode: "bigint" }),
    "para1": bigint("para1", { mode: "bigint" }),
    "para2": bigint("para2", { mode: "bigint" }),
    "lv": integer("lv"),
    "updateTime": bigint("updateTime", { mode: "bigint" }),
    "getLv": varchar("getLv", { length: 40 }),
    periodStart: bigint("periodStart", { mode: "bigint" }).notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({
      name: "activity_cost_PRIMARY",
      columns: [table["uid"], table["type"], table.periodStart],
    }),
  ],
);
