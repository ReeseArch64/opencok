// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const firstpaylog = cokdb1.table("firstpaylog", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "orderId": legacyText("orderId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "pf": legacyText("pf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "productId": legacyText("productId", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'0'")),
  "orderInfo": legacyText("orderInfo", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "time": bigint("time", { mode: "bigint" }),
  "currency": integer("currency").default(sql.raw("0")),
  "spend": legacyNumber("spend", {"sqlType":"numeric(10,2)"}).notNull().default(sql.raw("0.00")),
  "paid": legacyNumber("paid", {"sqlType":"numeric(10,2)"}).default(sql.raw("0.00")),
  "status": integer("status").default(sql.raw("0")),
  "payLevel": integer("payLevel").notNull(),
}, (table) => [
  primaryKey({ name: "firstpaylog_PRIMARY", columns: [table["uid"], table["orderId"], table["pf"]] }),
  uniqueIndex("firstpaylog_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"orderId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("firstpaylog_index_time_pf").on(sql.raw("\"time\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
