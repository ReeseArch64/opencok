import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const platform_first_login_reward = opencok_kingdom.table(
  "platform_first_login_reward",
  {
    "uid": varchar("uid", { length: 50 }).notNull(),
    "hasReward": integer("hasReward").notNull().default(sql.raw("0")),
    "pf": varchar("pf", { length: 40 }),
    "rewardTime": bigint("rewardTime", { mode: "bigint" }),
  },
  (table) => [primaryKey({ name: "platform_first_login_reward_PRIMARY", columns: [table["uid"]] })],
);
