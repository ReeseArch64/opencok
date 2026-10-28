import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_shop = opencok_kingdom.table(
    "alliance_shop",
    {
        "allianceId": varchar("allianceId", { length: 40 }).notNull(),
        "goodsId": varchar("goodsId", { length: 40 }).notNull(),
        "count": integer("count"),
    },
    (table) => [
        primaryKey({
            name: "alliance_shop_PRIMARY",
            columns: [table["allianceId"], table["goodsId"]],
        }),
        index("alliance_shop_index_alliance").on(sql.raw("\"allianceId\"")),
    ],
);
