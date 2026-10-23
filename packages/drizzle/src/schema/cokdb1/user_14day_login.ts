import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_14day_login = cokdb1.table("user_14day_login", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "day": integer("day").default(sql.raw("0")),
  "lastRewardTime": bigint("lastRewardTime", { mode: "bigint" }).default(sql.raw("0")),
  "vipRewardTime": bigint("vipRewardTime", { mode: "bigint" }).default(sql.raw("0")),
  "reward": varchar("reward", { length: 255 }),
}, (table) => [
  primaryKey({ name: "user_14day_login_PRIMARY", columns: [table["uid"], table["type"]] }),
  index("user_14day_login_day_index").on(sql.raw("\"day\"")),
]);
