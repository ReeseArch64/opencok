import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const paycheck = opencok_kingdom.table(
  "paycheck",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "orderId": varchar("orderId", { length: 200 }).notNull(),
    "pf": varchar("pf", { length: 20 }).notNull(),
    "time": bigint("time", { mode: "bigint" }),
    "status": varchar("status", { length: 20 }),
    "apidata": bytea("apidata"),
  },
  (table) => [
    primaryKey({
      name: "paycheck_PRIMARY",
      columns: [table["uid"], table["orderId"], table["pf"]],
    }),
    index("paycheck_index_time_status").on(sql.raw('"time"'), sql.raw('"status"')),
    check("paycheck_apidata_length", sql.raw('octet_length("apidata") <= 65535')),
  ],
);
