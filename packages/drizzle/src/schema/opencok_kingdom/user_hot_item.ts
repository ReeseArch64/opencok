import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_hot_item = opencok_kingdom.table(
    "user_hot_item",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "itemId": varchar("itemId", { length: 20 }).notNull(),
        "price": integer("price"),
        "num": integer("num"),
        "refreshTime": bigint("refreshTime", { mode: "bigint" }),
    },
    (table) => [
        primaryKey({ name: "user_hot_item_PRIMARY", columns: [table["uid"], table["itemId"]] }),
    ],
);
