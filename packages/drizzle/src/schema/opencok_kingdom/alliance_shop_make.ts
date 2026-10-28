import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_shop_make = opencok_kingdom.table(
    "alliance_shop_make",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "allianceId": varchar("allianceId", { length: 40 }).notNull(),
        "goodsId": varchar("goodsId", { length: 40 }),
        "count": integer("count"),
        "endTime": bigint("endTime", { mode: "bigint" }),
        "needTime": bigint("needTime", { mode: "bigint" }),
    },
    (table) => [
        primaryKey({ name: "alliance_shop_make_PRIMARY", columns: [table["uid"]] }),
        index("alliance_shop_make_index_alliance").on(sql.raw("\"allianceId\"")),
    ],
);
