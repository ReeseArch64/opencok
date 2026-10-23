import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_balance = cokdb1.table("user_balance", {
  "uid": varchar("uid", { length: 50 }).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "num": bigint("num", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "income": bigint("income", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "usable_income": bigint("usable_income", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "last_income_time": bigint("last_income_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "last_effect_time": bigint("last_effect_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_balance_PRIMARY", columns: [table["uid"], table["type"]] }),
]);
