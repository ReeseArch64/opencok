import { sql } from "drizzle-orm";
import { check, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_pay } from "../namespaces";

export const orders = opencok_pay.table(
    "orders",
    {
        "id": integer("id")
            .notNull()
            .generatedByDefaultAsIdentity({ "name": "orders_id_seq", "startWith": 1 }),
        "name": varchar("name", { length: 50 }).notNull(),
        "email": varchar("email", { length: 50 }).notNull(),
        "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("'0'")),
        "serverId": varchar("serverId", { length: 255 }),
        "orderId": varchar("orderId", { length: 255 }).notNull().default(sql.raw("''")),
        "ItemId": text("ItemId").notNull(),
        "ItemName": varchar("ItemName", { length: 255 }).notNull().default(sql.raw("''")),
        "gold": varchar("gold", { length: 255 }),
        "item_number": varchar("item_number", { length: 50 }).notNull(),
        "item_price": varchar("item_price", { length: 10 }).default(sql.raw("''")),
        "item_price_currency": varchar("item_price_currency", { length: 10 }).notNull(),
        "paid_amount": varchar("paid_amount", { length: 10 }),
        "paid_amount_currency": varchar("paid_amount_currency", { length: 10 }).notNull(),
        "txn_id": varchar("txn_id", { length: 50 }).notNull(),
        "payment_status": varchar("payment_status", { length: 25 }).notNull(),
        "created": text("created").notNull(),
        "modified": text("modified").notNull(),
    },
    (table) => [
        primaryKey({ name: "orders_PRIMARY", columns: [table["id"]] }),
        check(
            "orders_created_temporal",
            sql.raw(
                "(\"created\" IS NULL OR (CASE WHEN \"created\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left(\"created\",4) <> '0000' AND substring(\"created\",6,2) <> '00' AND substring(\"created\",9,2) <> '00' THEN to_char(to_date(left(\"created\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"created\",10) ELSE true END ELSE false END))",
            ),
        ),
        check(
            "orders_modified_temporal",
            sql.raw(
                "(\"modified\" IS NULL OR (CASE WHEN \"modified\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left(\"modified\",4) <> '0000' AND substring(\"modified\",6,2) <> '00' AND substring(\"modified\",9,2) <> '00' THEN to_char(to_date(left(\"modified\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"modified\",10) ELSE true END ELSE false END))",
            ),
        ),
    ],
);
