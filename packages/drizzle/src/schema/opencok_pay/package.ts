import { sql } from "drizzle-orm";
import { check, integer, numeric, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_pay } from "../namespaces";

export const packageTable = opencok_pay.table("package", {
  "Id": integer("Id").notNull().generatedByDefaultAsIdentity({"name":"package_Id_seq","startWith":1}),
  "name": varchar("name", { length: 255 }).default(sql.raw("''")),
  "usd": integer("usd").notNull().default(sql.raw("0")),
  "itemId": text("itemId"),
  "price": numeric("price", { precision: 10, scale: 2, mode: "string" }).notNull().default(sql.raw("100.00")),
  "status": varchar("status", { length: 255 }),
  "images": bytea("images").notNull().default(sql.raw("'57067_ad1_new'")),
  "currency": varchar("currency", { length: 255 }).notNull().default(sql.raw("'USD'")),
  "monthly_card": varchar("monthly_card", { length: 255 }).notNull().default(sql.raw("'1'")),
  "gold_pack_only": varchar("gold_pack_only", { length: 255 }).notNull().default(sql.raw("'0'")),
  "festival_item": varchar("festival_item", { length: 255 }),
  "pack_type": varchar("pack_type", { length: 255 }),
}, (table) => [
  primaryKey({ name: "package_PRIMARY", columns: [table["Id"]] }),
  check("package_images_length", sql.raw("octet_length(\"images\") <= 255")),
]);
