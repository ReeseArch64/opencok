import { sql } from "drizzle-orm";
import { bigint, index, integer, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const barbarion_statistics = opencok_kingdom.table(
    "barbarion_statistics",
    {
        "playerUid": varchar("playerUid", { length: 255 }).notNull(),
        "playerName": varchar("playerName", { length: 255 }).notNull(),
        "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
        "isSuccess": integer("isSuccess").default(sql.raw("0")),
        "strongHoldLevel": integer("strongHoldLevel").default(sql.raw("0")),
        "actType": integer("actType").default(sql.raw("0")),
    },
    (_table) => [
        uniqueIndex("barbarion_statistics_uid_name_time_index").on(
            sql.raw("\"playerUid\""),
            sql.raw("\"playerName\""),
            sql.raw("\"time\""),
        ),
        index("barbarion_statistics_playerUid_Index").on(sql.raw("\"playerUid\"")),
        index("barbarion_statistics_isSuccess_actType_index").on(
            sql.raw("\"isSuccess\""),
            sql.raw("\"actType\""),
        ),
        index("barbarion_statistics_strongHoldLevel_index").on(sql.raw("\"strongHoldLevel\"")),
        index("barbarion_statistics_actType_index").on(sql.raw("\"actType\"")),
    ],
);
