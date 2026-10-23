import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const feed_reward = opencok_kingdom.table(
  "feed_reward",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "feed_count": integer("feed_count"),
    "feed_time": bigint("feed_time", { mode: "bigint" }),
    "accept_count": integer("accept_count"),
    "accept_time": bigint("accept_time", { mode: "bigint" }),
    "feed_uuid": varchar("feed_uuid", { length: 255 }),
  },
  (table) => [primaryKey({ name: "feed_reward_PRIMARY", columns: [table["uid"]] })],
);
