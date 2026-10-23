import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_skill = opencok_kingdom.table("user_skill", {
  "uuid": varchar("uuid", { length: 40 }).notNull(),
  "ownerId": varchar("ownerId", { length: 40 }).notNull(),
  "skillId": varchar("skillId", { length: 40 }).notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "actTime": bigint("actTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "stat": integer("stat").default(sql.raw("0")),
  "param1": integer("param1").default(sql.raw("0")),
  "param2": integer("param2").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_skill_PRIMARY", columns: [table["uuid"]] }),
  index("user_skill_ownerId_index").on(sql.raw("\"ownerId\"")),
  index("user_skill_starttime_index").on(sql.raw("\"startTime\"")),
  index("user_skill_endtime_index").on(sql.raw("\"endTime\"")),
]);
