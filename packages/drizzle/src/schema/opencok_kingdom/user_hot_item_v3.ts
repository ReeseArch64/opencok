import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_hot_item_v3 = opencok_kingdom.table(
    "user_hot_item_v3",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "goodsId": varchar("goodsId", { length: 20 }).notNull(),
        "itemId": varchar("itemId", { length: 20 }).notNull(),
        "priceType": integer("priceType"),
        "price": integer("price").notNull(),
        "price_hot": integer("price_hot"),
        "num": integer("num"),
        "refreshTime": bigint("refreshTime", { mode: "bigint" }),
        "para1": integer("para1"),
        "type": smallint("type"),
    },
    (table) => [
        primaryKey({
            name: "user_hot_item_v3_PRIMARY",
            columns: [table["uid"], table["goodsId"], table["price"]],
        }),
        check("user_hot_item_v3_type_range", sql.raw("\"type\" BETWEEN -128 AND 127")),
    ],
);
