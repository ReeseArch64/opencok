import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const move_city_time = opencok_kingdom.table("move_city_time", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "move_city_time_PRIMARY", columns: [table["uid"]] }),
]);
