import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const time_reward = opencok_kingdom.table(
    "time_reward",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "itemId": varchar("itemId", { length: 255 }),
        "rewardId": varchar("rewardId", { length: 255 }),
        "lastRewardTime": bigint("lastRewardTime", { mode: "bigint" }),
        "nextRewardTime": bigint("nextRewardTime", { mode: "bigint" }),
        "count": integer("count"),
    },
    (table) => [primaryKey({ name: "time_reward_PRIMARY", columns: [table["uid"]] })],
);
