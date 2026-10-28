import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_equip_bak = opencok_kingdom.table(
    "user_equip_bak",
    {
        "uuid": varchar("uuid", { length: 255 }).notNull(),
        "uid": varchar("uid", { length: 255 }).notNull(),
        "on": integer("on").notNull().default(sql.raw("0")),
        "itemId": integer("itemId").notNull().default(sql.raw("0")),
        "cost": varchar("cost", { length: 255 }).default(sql.raw("''")),
        "extraProperty": varchar("extraProperty", { length: 255 }).default(sql.raw("''")),
        "refineProperty": varchar("refineProperty", { length: 255 }).default(sql.raw("''")),
    },
    (table) => [
        primaryKey({ name: "user_equip_bak_PRIMARY", columns: [table["uuid"]] }),
        index("user_equip_bak_index_uid_on").on(sql.raw("\"uid\""), sql.raw("\"on\"")),
    ],
);
