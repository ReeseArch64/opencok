import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_building_exp = opencok_kingdom.table("user_building_exp", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "historyMax": bigint("historyMax", { mode: "bigint" }).default(sql.raw("0")),
  "currentMax": bigint("currentMax", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_building_exp_PRIMARY", columns: [table["uid"]] }),
]);
