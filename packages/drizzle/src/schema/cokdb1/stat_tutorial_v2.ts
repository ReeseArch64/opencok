import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const stat_tutorial_v2 = cokdb1.table("stat_tutorial_v2", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "tutorial": bigint("tutorial", { mode: "bigint" }).notNull(),
  "time": bigint("time", { mode: "bigint" }),
  "appVersion": varchar("appVersion", { length: 40 }),
}, (table) => [
  primaryKey({ name: "stat_tutorial_v2_PRIMARY", columns: [table["uid"], table["tutorial"]] }),
  index("stat_tutorial_v2_index_time").on(sql.raw("\"time\""), sql.raw("\"appVersion\"")),
]);
