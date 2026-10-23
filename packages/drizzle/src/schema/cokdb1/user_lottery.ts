import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_lottery = cokdb1.table("user_lottery", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "lotteryId": varchar("lotteryId", { length: 40 }).notNull(),
  "times": integer("times"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_lottery_PRIMARY", columns: [table["uid"], table["lotteryId"]] }),
]);
