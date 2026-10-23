// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyNumber, legacyTemporal, legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const paypal_payments = cokdb_pay.table("paypal_payments", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "paypal_payments_id_seq", startWith: 2 }),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "pack_type": legacyText("pack_type", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "item_number": legacyText("item_number", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "item_name": legacyText("item_name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "item_price": legacyNumber("item_price", {"sqlType":"numeric(10,2)"}),
  "item_price_currency": legacyText("item_price_currency", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "payer_id": legacyText("payer_id", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "payer_name": legacyText("payer_name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "payer_email": legacyText("payer_email", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "payer_country": legacyText("payer_country", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "merchant_id": legacyText("merchant_id", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "merchant_email": legacyText("merchant_email", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "order_id": legacyText("order_id", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "transaction_id": legacyText("transaction_id", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "paid_amount": legacyNumber("paid_amount", {"sqlType":"numeric(10,2)"}).notNull(),
  "paid_amount_currency": legacyText("paid_amount_currency", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull(),
  "payment_source": legacyText("payment_source", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "payment_status": legacyText("payment_status", {"sqlType":"character varying(25)","collation":"legacy_meta.ci"}).notNull(),
  "created": legacyTemporal("created").notNull(),
  "modified": legacyTemporal("modified").notNull(),
}, (table) => [
  primaryKey({ name: "paypal_payments_PRIMARY", columns: [table["id"]] }),
  check("paypal_payments_created_temporal", sql.raw("legacy_meta.valid_temporal(\"created\", 'datetime', 0)")),
  check("paypal_payments_modified_temporal", sql.raw("legacy_meta.valid_temporal(\"modified\", 'datetime', 0)")),
]);
