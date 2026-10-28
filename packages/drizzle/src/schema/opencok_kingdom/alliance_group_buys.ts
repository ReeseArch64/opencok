import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_group_buys = opencok_kingdom.table(
    "alliance_group_buys",
    {
        "id": varchar("id", { length: 40 }).notNull(),
        "uid": varchar("uid", { length: 40 }).notNull(),
        "round": integer("round").notNull(),
        "name": varchar("name", { length: 40 }),
        "allianceId": varchar("allianceId", { length: 40 }),
        "point": integer("point"),
        "buyTime": bigint("buyTime", { mode: "bigint" }),
        "info": varchar("info", { length: 1000 }),
        "reward": integer("reward"),
    },
    (table) => [
        primaryKey({
            name: "alliance_group_buys_PRIMARY",
            columns: [table["id"], table["uid"], table["round"]],
        }),
        index("alliance_group_buys_index_allianceId").on(sql.raw("\"allianceId\"")),
        index("alliance_group_buys_index_time").on(sql.raw("\"buyTime\"")),
    ],
);
