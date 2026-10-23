import { sql } from "drizzle-orm";
import { bigint, integer, numeric, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { cokdb_pay } from "../namespaces";

export const exchange = cokdb_pay.table("exchange", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({"name":"exchange_id_seq","startWith":9}),
  "orderId": varchar("orderId", { length: 255 }).notNull().default(sql.raw("'11001'")),
  "paidGold": bigint("paidGold", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "name": varchar("name", { length: 255 }),
  "price": numeric("price", { precision: 10, scale: 2, mode: "string" }),
  "images": varchar("images", { length: 255 }),
  "ItemId": text("ItemId"),
  "monthly_card": integer("monthly_card").notNull().default(sql.raw("2")),
  "status": varchar("status", { length: 255 }),
  "currency": varchar("currency", { length: 255 }).notNull().default(sql.raw("'USD'")),
  "pack_type": varchar("pack_type", { length: 255 }).notNull().default(sql.raw("'1'")),
  "discount": integer("discount").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "exchange_PRIMARY", columns: [table["id"]] }),
]);
