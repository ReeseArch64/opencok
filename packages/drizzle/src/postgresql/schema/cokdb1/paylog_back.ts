// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const paylog_back = cokdb1.table("paylog_back", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "orderId": legacyText("orderId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "productId": legacyText("productId", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'0'")),
  "time": bigint("time", { mode: "bigint" }),
  "currency": integer("currency").default(sql.raw("0")),
  "spend": legacyNumber("spend", {"sqlType":"numeric(10,0)"}).notNull().default(sql.raw("0")),
  "status": integer("status").default(sql.raw("0")),
  "payLevel": integer("payLevel").notNull(),
}, (table) => [
  primaryKey({ name: "paylog_back_PRIMARY", columns: [table["uid"], table["orderId"]] }),
  uniqueIndex("paylog_back_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"orderId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
