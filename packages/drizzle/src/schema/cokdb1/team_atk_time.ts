import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const team_atk_time = cokdb1.table("team_atk_time", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "team_atk_time_PRIMARY", columns: [table["uid"]] }),
]);
