import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_balance_history_8 = cokdb1.table("user_balance_history_8", {
  "uuid": varchar("uuid", { length: 50 }).notNull(),
  "uid": varchar("uid", { length: 50 }).notNull(),
  "bank_type": integer("bank_type").notNull().default(sql.raw("0")),
  "type": integer("type").notNull().default(sql.raw("0")),
  "num": bigint("num", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "original_num": bigint("original_num", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "curr_sum": bigint("curr_sum", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "curr_charge0": bigint("curr_charge0", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "curr_usable_income": bigint("curr_usable_income", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "state": integer("state").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_balance_history_8_PRIMARY", columns: [table["uuid"]] }),
  index("user_balance_history_8_uid_bank_type").on(sql.raw("\"uid\""), sql.raw("\"bank_type\"")),
  index("user_balance_history_8_time").on(sql.raw("\"time\"")),
]);
