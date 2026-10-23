// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, numeric, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const exchange = cokdb_pay.table("exchange", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "exchange_id_seq", startWith: 9 }),
  "orderId": legacyText("orderId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'11001'")),
  "paidGold": bigint("paidGold", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "price": numeric("price", { precision: 10, scale: 2 }),
  "images": legacyText("images", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "ItemId": legacyText("ItemId", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "monthly_card": integer("monthly_card").notNull().default(sql.raw("2")),
  "status": legacyText("status", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "currency": legacyText("currency", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'USD'")),
  "pack_type": legacyText("pack_type", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'1'")),
  "discount": integer("discount").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "exchange_PRIMARY", columns: [table["id"]] }),
]);
