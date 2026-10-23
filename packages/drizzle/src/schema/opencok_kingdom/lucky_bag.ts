import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const lucky_bag = opencok_kingdom.table(
  "lucky_bag",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "openFreetimes": integer("openFreetimes").default(sql.raw("0")),
    "flushTimes": integer("flushTimes").default(sql.raw("0")),
    "nextOpenTime": integer("nextOpenTime").default(sql.raw("0")),
    "multiple": integer("multiple").default(sql.raw("1")),
    "score": integer("score").default(sql.raw("0")),
    "scoreReward": varchar("scoreReward", { length: 255 }),
  },
  (table) => [primaryKey({ name: "lucky_bag_PRIMARY", columns: [table["uid"]] })],
);
