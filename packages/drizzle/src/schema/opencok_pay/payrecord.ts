import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_pay } from "../namespaces";

export const payrecord = opencok_pay.table(
  "payrecord",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "orderId": varchar("orderId", { length: 200 }).notNull(),
    "method": varchar("method", { length: 20 }).notNull(),
    "request": bytea("request"),
    "postParam": bytea("postParam"),
    "result": bytea("result"),
    "time": bigint("time", { mode: "bigint" }),
    "lastCheckTime": integer("lastCheckTime"),
    "checkTimes": integer("checkTimes").default(sql.raw("0")),
    "checkHistory": bytea("checkHistory"),
    "checkResult": integer("checkResult").default(sql.raw("0")),
  },
  (table) => [
    primaryKey({
      name: "payrecord_PRIMARY",
      columns: [table["uid"], table["orderId"], table["method"]],
    }),
    index("payrecord_index").on(sql.raw('"time"'), sql.raw('"method"'), sql.raw('"checkResult"')),
    check("payrecord_request_length", sql.raw('octet_length("request") <= 65535')),
    check("payrecord_postParam_length", sql.raw('octet_length("postParam") <= 65535')),
    check("payrecord_result_length", sql.raw('octet_length("result") <= 65535')),
    check("payrecord_checkHistory_length", sql.raw('octet_length("checkHistory") <= 65535')),
  ],
);
