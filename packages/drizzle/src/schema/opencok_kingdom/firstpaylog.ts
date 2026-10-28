import { sql } from "drizzle-orm";
import { bigint, index, integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const firstpaylog = opencok_kingdom.table(
    "firstpaylog",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "orderId": varchar("orderId", { length: 200 }).notNull(),
        "pf": varchar("pf", { length: 20 }).notNull(),
        "productId": varchar("productId", { length: 10 }).notNull().default(sql.raw("'0'")),
        "orderInfo": varchar("orderInfo", { length: 100 }).default(sql.raw("''")),
        "time": bigint("time", { mode: "bigint" }),
        "currency": integer("currency").default(sql.raw("0")),
        "spend": numeric("spend", { precision: 10, scale: 2, mode: "number" })
            .notNull()
            .default(sql.raw("0.00")),
        "paid": numeric("paid", { precision: 10, scale: 2, mode: "number" }).default(
            sql.raw("0.00"),
        ),
        "status": integer("status").default(sql.raw("0")),
        "payLevel": integer("payLevel").notNull(),
    },
    (table) => [
        primaryKey({
            name: "firstpaylog_PRIMARY",
            columns: [table["uid"], table["orderId"], table["pf"]],
        }),
        index("firstpaylog_index_time_pf").on(sql.raw("\"time\""), sql.raw("\"pf\"")),
    ],
);
