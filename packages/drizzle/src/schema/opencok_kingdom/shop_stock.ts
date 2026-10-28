import { bigint, check, varchar, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { opencok_kingdom } from "../namespaces";

export const shop_stock = opencok_kingdom.table(
    "shop_stock",
    {
        id: varchar("id", { length: 40 }).notNull(),
        purchased: bigint("purchased", { mode: "bigint" })
            .notNull()
            .default(sql`0`),
    },
    (table) => [
        primaryKey({ name: "shop_stock_PRIMARY", columns: [table.id] }),
        check("shop_stock_nonnegative", sql`"purchased" >= 0`),
    ],
);
