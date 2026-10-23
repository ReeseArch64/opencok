import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_achievement = opencok_kingdom.table("user_achievement", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "id": varchar("id", { length: 255 }).notNull(),
  "num": bigint("num", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "state": integer("state").notNull().default(sql.raw("0")),
  "completeTime": bigint("completeTime", { mode: "bigint" }).default(sql.raw("0")),
  "rewardTime": bigint("rewardTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_achievement_PRIMARY", columns: [table["uid"], table["id"]] }),
]);
