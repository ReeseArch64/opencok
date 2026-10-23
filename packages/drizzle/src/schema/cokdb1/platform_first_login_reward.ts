import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const platform_first_login_reward = cokdb1.table("platform_first_login_reward", {
  "uid": varchar("uid", { length: 50 }).notNull(),
  "hasReward": integer("hasReward").notNull().default(sql.raw("0")),
  "pf": varchar("pf", { length: 40 }),
  "rewardTime": bigint("rewardTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "platform_first_login_reward_PRIMARY", columns: [table["uid"]] }),
]);
