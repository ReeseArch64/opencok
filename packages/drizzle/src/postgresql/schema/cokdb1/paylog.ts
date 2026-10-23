// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const paylog = cokdb1.table("paylog", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "orderId": legacyText("orderId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "pf": legacyText("pf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "productId": legacyText("productId", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'0'")),
  "orderInfo": legacyText("orderInfo", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "orderParam": legacyBytes("orderParam"),
  "comments": legacyText("comments", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "time": bigint("time", { mode: "bigint" }),
  "currency": integer("currency").default(sql.raw("0")),
  "spend": legacyNumber("spend", {"sqlType":"numeric(10,2)"}).notNull().default(sql.raw("0.00")),
  "paid": legacyNumber("paid", {"sqlType":"numeric(10,2)"}).default(sql.raw("0.00")),
  "status": integer("status").default(sql.raw("0")),
  "payLevel": integer("payLevel").notNull(),
  "buildingLv": integer("buildingLv").default(sql.raw("0")),
  "receiverId": legacyText("receiverId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "deviceId": legacyText("deviceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "ip": legacyText("ip", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "curGaid": legacyText("curGaid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "truelyIp": legacyText("truelyIp", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "optionId": legacyText("optionId", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "paylog_PRIMARY", columns: [table["uid"], table["orderId"], table["pf"]] }),
  uniqueIndex("paylog_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"orderId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("paylog_index_time_pf").on(sql.raw("\"time\""), sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("paylog_orderParam_length", sql.raw("octet_length(\"orderParam\") <= 65535")),
]);
