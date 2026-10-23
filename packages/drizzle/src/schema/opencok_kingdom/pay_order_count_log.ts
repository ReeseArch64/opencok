import { sql } from "drizzle-orm";
import { bigint, index, integer, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const pay_order_count_log = opencok_kingdom.table(
  "pay_order_count_log",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "className": varchar("className", { length: 40 }).notNull(),
    "action": integer("action").default(sql.raw("0")),
    "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  },
  (_table) => [
    index("pay_order_count_log_index_time").on(sql.raw('"time"')),
    index("pay_order_count_log_index_uid_class").on(sql.raw('"uid"'), sql.raw('"className"')),
  ],
);
