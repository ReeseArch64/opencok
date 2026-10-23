import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const reward_log_0 = opencok_kingdom.table(
  "reward_log_0",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "rewardid": varchar("rewardid", { length: 255 }).notNull(),
    "nownum": integer("nownum").default(sql.raw("0")),
    "totalnum": bigint("totalnum", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "reward_log_0_PRIMARY", columns: [table["uid"], table["rewardid"]] }),
  ],
);
