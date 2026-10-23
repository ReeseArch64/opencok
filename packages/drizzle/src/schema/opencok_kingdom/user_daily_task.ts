import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_daily_task = opencok_kingdom.table(
  "user_daily_task",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "id": varchar("id", { length: 255 }).notNull(),
    "num": integer("num").notNull().default(sql.raw("0")),
    "times": integer("times").notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "user_daily_task_PRIMARY", columns: [table["uid"], table["id"]] }),
  ],
);
