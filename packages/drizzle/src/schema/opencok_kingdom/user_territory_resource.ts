import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_territory_resource = opencok_kingdom.table(
    "user_territory_resource",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "allianceId": varchar("allianceId", { length: 255 }),
        "wood": bigint("wood", { mode: "bigint" }).default(sql.raw("0")),
        "stone": bigint("stone", { mode: "bigint" }).default(sql.raw("0")),
        "iron": bigint("iron", { mode: "bigint" }).default(sql.raw("0")),
        "food": bigint("food", { mode: "bigint" }).default(sql.raw("0")),
        "silver": bigint("silver", { mode: "bigint" }).default(sql.raw("0")),
        "lastUpdateTime": bigint("lastUpdateTime", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "user_territory_resource_PRIMARY", columns: [table["uid"]] }),
        index("user_territory_resource_al_idx").on(sql.raw("\"allianceId\"")),
    ],
);
