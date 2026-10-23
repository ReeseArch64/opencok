import { sql } from "drizzle-orm";
import { doublePrecision, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const expedition_fail_award = opencok_kingdom.table(
  "expedition_fail_award",
  {
    "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
    "score": doublePrecision("score").default(sql.raw("0")),
    "rewardId": varchar("rewardId", { length: 20 }).notNull().default(sql.raw("''")),
    "rank": integer("rank").notNull(),
  },
  (table) => [primaryKey({ name: "expedition_fail_award_PRIMARY", columns: [table["uid"]] })],
);
