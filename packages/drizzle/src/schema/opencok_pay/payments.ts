import { integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_pay } from "../namespaces";

export const payments = opencok_pay.table(
  "payments",
  {
    "payment_id": integer("payment_id")
      .notNull()
      .generatedByDefaultAsIdentity({ "name": "payments_payment_id_seq", "startWith": 1 }),
    "name": varchar("name", { length: 255 }),
    "uid": varchar("uid", { length: 11 }),
    "item_name": varchar("item_name", { length: 255 }),
    "item_number": varchar("item_number", { length: 50 }).notNull(),
    "txn_id": varchar("txn_id", { length: 50 }).notNull(),
    "payment_gross": numeric("payment_gross", {
      precision: 10,
      scale: 2,
      mode: "number",
    }).notNull(),
    "currency_code": varchar("currency_code", { length: 5 }).notNull(),
    "payment_status": varchar("payment_status", { length: 20 }).notNull(),
  },
  (table) => [primaryKey({ name: "payments_PRIMARY", columns: [table["payment_id"]] })],
);
