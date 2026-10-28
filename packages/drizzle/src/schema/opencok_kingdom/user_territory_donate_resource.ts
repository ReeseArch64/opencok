import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_territory_donate_resource = opencok_kingdom.table(
    "user_territory_donate_resource",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "allianceId": varchar("allianceId", { length: 255 }).notNull(),
        "stone": bigint("stone", { mode: "bigint" }).notNull(),
        "wood": bigint("wood", { mode: "bigint" }).notNull(),
        "iron": bigint("iron", { mode: "bigint" }).notNull(),
        "food": bigint("food", { mode: "bigint" }).notNull(),
        "sandStone": bigint("sandStone", { mode: "bigint" }).notNull(),
        "diamondStone": bigint("diamondStone", { mode: "bigint" }).notNull(),
        "marble": bigint("marble", { mode: "bigint" }).notNull(),
        "granite": bigint("granite", { mode: "bigint" }).notNull(),
        "limestone": bigint("limestone", { mode: "bigint" }).notNull(),
        "lastUpdateTime": bigint("lastUpdateTime", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({ name: "user_territory_donate_resource_PRIMARY", columns: [table["uid"]] }),
    ],
);
