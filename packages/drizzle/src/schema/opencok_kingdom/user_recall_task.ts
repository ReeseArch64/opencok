import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_recall_task = opencok_kingdom.table(
  "user_recall_task",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "id": varchar("id", { length: 255 }).notNull(),
    "num": integer("num").notNull().default(sql.raw("0")),
    "target_num": integer("target_num").notNull().default(sql.raw("0")),
    "state": integer("state").notNull().default(sql.raw("0")),
    "type_level": integer("type_level").notNull().default(sql.raw("0")),
    "receive": integer("receive").notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "user_recall_task_PRIMARY", columns: [table["uid"], table["id"]] }),
  ],
);
