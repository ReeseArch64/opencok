import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_pay_reward = cokdb1.table("user_pay_reward", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "itemId": varchar("itemId", { length: 40 }),
  "buyTime": bigint("buyTime", { mode: "bigint" }),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }),
  "time": bigint("time", { mode: "bigint" }),
  "extra": varchar("extra", { length: 2000 }),
}, (table) => [
  primaryKey({ name: "user_pay_reward_PRIMARY", columns: [table["uid"]] }),
]);
