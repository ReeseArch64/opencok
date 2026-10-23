// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyNumber, legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const global_paylog = cokdb_global.table("global_paylog", {
  "sid": integer("sid").notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "orderId": legacyText("orderId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "pf": legacyText("pf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "productId": legacyText("productId", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'0'")),
  "orderInfo": legacyText("orderInfo", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "orderParam": legacyBytes("orderParam"),
  "time": bigint("time", { mode: "bigint" }),
  "currency": integer("currency").default(sql.raw("0")),
  "spend": legacyNumber("spend", {"sqlType":"numeric(10,2)"}).notNull().default(sql.raw("0.00")),
  "paid": legacyNumber("paid", {"sqlType":"numeric(10,2)"}).default(sql.raw("0.00")),
  "status": integer("status").default(sql.raw("0")),
  "payLevel": integer("payLevel").notNull(),
  "buildingLv": integer("buildingLv"),
  "receiverId": legacyText("receiverId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "deviceId": legacyText("deviceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "ip": legacyText("ip", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "global_paylog_PRIMARY", columns: [table["sid"], table["uid"], table["orderId"], table["pf"]] }),
  uniqueIndex("global_paylog_PRIMARY_pad").on(sql.raw("\"sid\""), sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"orderId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("global_paylog_ipAndTime").on(sql.raw("rtrim(\"ip\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
  check("global_paylog_orderParam_length", sql.raw("octet_length(\"orderParam\") <= 65535")),
]);
