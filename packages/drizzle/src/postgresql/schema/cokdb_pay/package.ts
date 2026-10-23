// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, numeric, primaryKey } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const packageTable = cokdb_pay.table("package", {
  "Id": integer("Id").notNull().generatedByDefaultAsIdentity({ name: "package_Id_seq", startWith: 1 }),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "usd": integer("usd").notNull().default(sql.raw("0")),
  "itemId": legacyText("itemId", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "price": numeric("price", { precision: 10, scale: 2 }).notNull().default(sql.raw("100.00")),
  "status": legacyText("status", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "images": legacyBytes("images").notNull().default(sql.raw("'57067_ad1_new'")),
  "currency": legacyText("currency", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'USD'")),
  "monthly_card": legacyText("monthly_card", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'1'")),
  "gold_pack_only": legacyText("gold_pack_only", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'0'")),
  "festival_item": legacyText("festival_item", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "pack_type": legacyText("pack_type", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "package_PRIMARY", columns: [table["Id"]] }),
  check("package_images_length", sql.raw("octet_length(\"images\") <= 255")),
]);
