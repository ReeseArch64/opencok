// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const paylog_tmp_2 = cokdb_global.table("paylog_tmp_2", {
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
  "buildingLv": integer("buildingLv").default(sql.raw("0")),
  "receiverId": legacyText("receiverId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
}, (_table) => [
  index("paylog_tmp_2_index_time_pf").on(sql.raw("\"time\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("paylog_tmp_2_index_orderid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"orderId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
