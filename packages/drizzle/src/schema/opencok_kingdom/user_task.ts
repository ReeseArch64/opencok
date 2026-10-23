import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_task = opencok_kingdom.table(
  "user_task",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "id": varchar("id", { length: 255 }).notNull(),
    "num": integer("num").notNull().default(sql.raw("0")),
    "state": integer("state").notNull().default(sql.raw("0")),
    "type": integer("type").notNull().default(sql.raw("1")),
  },
  (table) => [primaryKey({ name: "user_task_PRIMARY", columns: [table["uid"], table["id"]] })],
);
