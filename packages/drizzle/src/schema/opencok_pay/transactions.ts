import { sql } from "drizzle-orm";
import { check, integer, numeric, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_pay } from "../namespaces";

export const transactions = opencok_pay.table(
  "transactions",
  {
    "id": integer("id")
      .notNull()
      .generatedByDefaultAsIdentity({ "name": "transactions_id_seq", "startWith": 3 }),
    "uid": varchar("uid", { length: 255 }),
    "orderId": varchar("orderId", { length: 255 }),
    "ItemId": varchar("ItemId", { length: 255 }),
    "ItemName": varchar("ItemName", { length: 255 }),
    "item_number": varchar("item_number", { length: 50 }),
    "item_name": varchar("item_name", { length: 255 }),
    "item_price": numeric("item_price", { precision: 10, scale: 2, mode: "number" }),
    "item_price_currency": varchar("item_price_currency", { length: 10 }),
    "payer_id": varchar("payer_id", { length: 50 }),
    "payer_name": varchar("payer_name", { length: 50 }),
    "payer_email": varchar("payer_email", { length: 50 }),
    "payer_country": varchar("payer_country", { length: 20 }),
    "merchant_id": varchar("merchant_id", { length: 255 }),
    "merchant_email": varchar("merchant_email", { length: 50 }),
    "order_id": varchar("order_id", { length: 50 }).notNull(),
    "transaction_id": varchar("transaction_id", { length: 50 }).notNull(),
    "paid_amount": numeric("paid_amount", { precision: 10, scale: 2, mode: "number" }).notNull(),
    "paid_amount_currency": varchar("paid_amount_currency", { length: 10 }).notNull(),
    "payment_source": varchar("payment_source", { length: 50 }),
    "payment_status": varchar("payment_status", { length: 25 }).notNull(),
    "created": text("created").notNull(),
    "modified": text("modified").notNull(),
  },
  (table) => [
    primaryKey({ name: "transactions_PRIMARY", columns: [table["id"]] }),
    check(
      "transactions_created_temporal",
      sql.raw(
        '("created" IS NULL OR (CASE WHEN "created" ~ \'^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$\' THEN CASE WHEN left("created",4) <> \'0000\' AND substring("created",6,2) <> \'00\' AND substring("created",9,2) <> \'00\' THEN to_char(to_date(left("created",10),\'YYYY-MM-DD\'),\'YYYY-MM-DD\') = left("created",10) ELSE true END ELSE false END))',
      ),
    ),
    check(
      "transactions_modified_temporal",
      sql.raw(
        '("modified" IS NULL OR (CASE WHEN "modified" ~ \'^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$\' THEN CASE WHEN left("modified",4) <> \'0000\' AND substring("modified",6,2) <> \'00\' AND substring("modified",9,2) <> \'00\' THEN to_char(to_date(left("modified",10),\'YYYY-MM-DD\'),\'YYYY-MM-DD\') = left("modified",10) ELSE true END ELSE false END))',
      ),
    ),
  ],
);
