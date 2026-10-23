// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const payrecord = cokdb_pay.table("payrecord", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "orderId": legacyText("orderId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "method": legacyText("method", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "request": legacyBytes("request"),
  "postParam": legacyBytes("postParam"),
  "result": legacyBytes("result"),
  "time": bigint("time", { mode: "bigint" }),
  "lastCheckTime": integer("lastCheckTime"),
  "checkTimes": integer("checkTimes").default(sql.raw("0")),
  "checkHistory": legacyBytes("checkHistory"),
  "checkResult": integer("checkResult").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "payrecord_PRIMARY", columns: [table["uid"], table["orderId"], table["method"]] }),
  uniqueIndex("payrecord_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"orderId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"method\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("payrecord_index").on(sql.raw("\"time\""), sql.raw("rtrim(\"method\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"checkResult\"")),
  check("payrecord_request_length", sql.raw("octet_length(\"request\") <= 65535")),
  check("payrecord_postParam_length", sql.raw("octet_length(\"postParam\") <= 65535")),
  check("payrecord_result_length", sql.raw("octet_length(\"result\") <= 65535")),
  check("payrecord_checkHistory_length", sql.raw("octet_length(\"checkHistory\") <= 65535")),
]);
