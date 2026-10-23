import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const gold_wish_pool = opencok_kingdom.table(
  "gold_wish_pool",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "times": integer("times").notNull(),
    "costGold": integer("costGold"),
    "getGold": integer("getGold"),
    "rate": integer("rate"),
    "time": bigint("time", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({ name: "gold_wish_pool_PRIMARY", columns: [table["uid"], table["times"]] }),
    index("gold_wish_pool_byUid").on(sql.raw('"uid"')),
  ],
);
