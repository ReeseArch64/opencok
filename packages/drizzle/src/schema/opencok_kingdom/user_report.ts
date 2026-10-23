import { sql } from "drizzle-orm";
import { bigint, index, integer, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_report = opencok_kingdom.table("user_report", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "target_uid": varchar("target_uid", { length: 40 }).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (_table) => [
  index("user_report_uid").on(sql.raw("\"uid\"")),
  index("user_report_target_uid").on(sql.raw("\"target_uid\"")),
  index("user_report_time").on(sql.raw("\"time\"")),
]);
