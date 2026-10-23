import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const stat_tutorial = cokdb1.table("stat_tutorial", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "tutorial": bigint("tutorial", { mode: "bigint" }).notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "stat_tutorial_PRIMARY", columns: [table["uid"], table["tutorial"]] }),
  index("stat_tutorial_index_time").on(sql.raw("\"time\"")),
  index("stat_tutorial_index_tutorial").on(sql.raw("\"tutorial\"")),
]);
