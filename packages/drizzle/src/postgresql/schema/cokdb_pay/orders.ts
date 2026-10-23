// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyTemporal, legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const orders = cokdb_pay.table("orders", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "orders_id_seq", startWith: 1 }),
  "name": legacyText("name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "email": legacyText("email", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.sv_ci"}).notNull().default(sql.raw("'0'")),
  "serverId": legacyText("serverId", {"sqlType":"character varying(255)","collation":"legacy_meta.sv_ci"}),
  "orderId": legacyText("orderId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "ItemId": legacyText("ItemId", {"sqlType":"text","collation":"legacy_meta.ci"}).notNull(),
  "ItemName": legacyText("ItemName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "gold": legacyText("gold", {"sqlType":"character varying(255)","collation":"legacy_meta.sv_ci"}),
  "item_number": legacyText("item_number", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "item_price": legacyText("item_price", {"sqlType":"character varying(10)","collation":"legacy_meta.sv_ci"}).default(sql.raw("''")),
  "item_price_currency": legacyText("item_price_currency", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull(),
  "paid_amount": legacyText("paid_amount", {"sqlType":"character varying(10)","collation":"legacy_meta.sv_ci"}),
  "paid_amount_currency": legacyText("paid_amount_currency", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull(),
  "txn_id": legacyText("txn_id", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "payment_status": legacyText("payment_status", {"sqlType":"character varying(25)","collation":"legacy_meta.ci"}).notNull(),
  "created": legacyTemporal("created").notNull(),
  "modified": legacyTemporal("modified").notNull(),
}, (table) => [
  primaryKey({ name: "orders_PRIMARY", columns: [table["id"]] }),
  check("orders_created_temporal", sql.raw("legacy_meta.valid_temporal(\"created\", 'datetime', 0)")),
  check("orders_modified_temporal", sql.raw("legacy_meta.valid_temporal(\"modified\", 'datetime', 0)")),
]);
