import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_gift_vote = opencok_kingdom.table(
  "user_gift_vote",
  {
    "uid": varchar("uid", { length: 50 }).notNull(),
    "version": integer("version").notNull(),
    "type": integer("type").notNull(),
    "giftId": integer("giftId").notNull(),
    "time": bigint("time", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({
      name: "user_gift_vote_PRIMARY",
      columns: [table["uid"], table["version"], table["type"], table["giftId"]],
    }),
  ],
);
