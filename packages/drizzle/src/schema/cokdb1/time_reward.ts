import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const time_reward = cokdb1.table("time_reward", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "itemId": varchar("itemId", { length: 255 }),
  "rewardId": varchar("rewardId", { length: 255 }),
  "lastRewardTime": bigint("lastRewardTime", { mode: "bigint" }),
  "nextRewardTime": bigint("nextRewardTime", { mode: "bigint" }),
  "count": integer("count"),
}, (table) => [
  primaryKey({ name: "time_reward_PRIMARY", columns: [table["uid"]] }),
]);
