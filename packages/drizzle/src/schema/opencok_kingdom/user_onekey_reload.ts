import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_onekey_reload = opencok_kingdom.table(
    "user_onekey_reload",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "generalId": varchar("generalId", { length: 40 }).notNull(),
        "type": integer("type").notNull().default(sql.raw("0")),
        "equip_list": varchar("equip_list", { length: 2048 }).notNull().default(sql.raw("''")),
        "talentPoint": integer("talentPoint").notNull().default(sql.raw("0")),
        "talent": varchar("talent", { length: 5120 }).notNull().default(sql.raw("''")),
        "dragon_stone_rhyme": varchar("dragon_stone_rhyme", { length: 40 })
            .notNull()
            .default(sql.raw("''")),
    },
    (table) => [
        primaryKey({
            name: "user_onekey_reload_PRIMARY",
            columns: [table["uid"], table["generalId"], table["type"]],
        }),
    ],
);
