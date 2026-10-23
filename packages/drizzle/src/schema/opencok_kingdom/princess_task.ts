import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const princess_task = opencok_kingdom.table("princess_task", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "id": varchar("id", { length: 255 }).notNull(),
  "num": integer("num").notNull().default(sql.raw("0")),
  "sub": varchar("sub", { length: 255 }).notNull(),
  "state": integer("state").notNull().default(sql.raw("0")),
  "type": integer("type").notNull().default(sql.raw("1")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "completeTime": bigint("completeTime", { mode: "bigint" }).default(sql.raw("0")),
  "pop": integer("pop").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "princess_task_PRIMARY", columns: [table["uid"], table["id"]] }),
]);
