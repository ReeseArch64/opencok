import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_lottery = opencok_kingdom.table("user_lottery", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "lotteryId": varchar("lotteryId", { length: 40 }).notNull(),
  "times": integer("times"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_lottery_PRIMARY", columns: [table["uid"], table["lotteryId"]] }),
]);
