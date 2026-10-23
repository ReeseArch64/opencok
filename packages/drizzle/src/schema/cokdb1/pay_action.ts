import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const pay_action = cokdb1.table("pay_action", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "exchangeId": varchar("exchangeId", { length: 20 }).notNull(),
  "pf": varchar("pf", { length: 20 }),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "pay_action_PRIMARY", columns: [table["uid"], table["exchangeId"], table["createTime"]] }),
]);
