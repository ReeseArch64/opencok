import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_pet_dragon = opencok_kingdom.table(
    "user_pet_dragon",
    {
        "uuid": varchar("uuid", { length: 255 }).notNull(),
        "uid": varchar("uid", { length: 255 }).notNull(),
        "itemId": integer("itemId").notNull(),
        "dragonState": smallint("dragonState").notNull().default(sql.raw("0")),
        "friendly": integer("friendly").default(sql.raw("0")),
        "clickBubbleTimesForDay": smallint("clickBubbleTimesForDay").default(sql.raw("0")),
        "clickBubbleTotalTimes": integer("clickBubbleTotalTimes").default(sql.raw("0")),
        "gainEggTime": bigint("gainEggTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
        "clickEggTime": bigint("clickEggTime", { mode: "bigint" }).default(sql.raw("0")),
        "lastClickBubbleTime": bigint("lastClickBubbleTime", { mode: "bigint" }).default(
            sql.raw("0"),
        ),
        "useFlag": smallint("useFlag").notNull().default(sql.raw("0")),
        "friendShipDecreaseTime": bigint("friendShipDecreaseTime", { mode: "bigint" }).default(
            sql.raw("0"),
        ),
        "travelData": varchar("travelData", { length: 2000 }),
        "communicateData": varchar("communicateData", { length: 500 }),
        "exp": integer("exp").default(sql.raw("0")),
        "initFriendShipFlag": smallint("initFriendShipFlag").default(sql.raw("0")),
        "lastUpLevelTime": bigint("lastUpLevelTime", { mode: "bigint" }).default(sql.raw("0")),
        "lv": smallint("lv").default(sql.raw("1")),
        "nickName": varchar("nickName", { length: 128 }),
    },
    (table) => [
        primaryKey({ name: "user_pet_dragon_PRIMARY", columns: [table["uuid"]] }),
        index("user_pet_dragon_index_uid").on(sql.raw("\"uid\"")),
        check("user_pet_dragon_dragonState_range", sql.raw("\"dragonState\" BETWEEN -128 AND 127")),
        check("user_pet_dragon_useFlag_range", sql.raw("\"useFlag\" BETWEEN -128 AND 127")),
        check(
            "user_pet_dragon_initFriendShipFlag_range",
            sql.raw("\"initFriendShipFlag\" BETWEEN -128 AND 127"),
        ),
    ],
);
