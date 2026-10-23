// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const paycheck = cokdb1.table("paycheck", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "orderId": legacyText("orderId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "pf": legacyText("pf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }),
  "status": legacyText("status", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "apidata": legacyBytes("apidata"),
}, (table) => [
  primaryKey({ name: "paycheck_PRIMARY", columns: [table["uid"], table["orderId"], table["pf"]] }),
  uniqueIndex("paycheck_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"orderId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("paycheck_index_time_status").on(sql.raw("\"time\""), sql.raw("rtrim(\"status\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("paycheck_apidata_length", sql.raw("octet_length(\"apidata\") <= 65535")),
]);
