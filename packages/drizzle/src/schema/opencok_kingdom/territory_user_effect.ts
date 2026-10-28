import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const territory_user_effect = opencok_kingdom.table(
    "territory_user_effect",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "pointId": integer("pointId").notNull(),
        "allianceId": varchar("allianceId", { length: 255 }),
        "stat": integer("stat"),
        "active": integer("active"),
    },
    (table) => [
        primaryKey({
            name: "territory_user_effect_PRIMARY",
            columns: [table["uid"], table["pointId"]],
        }),
        index("territory_user_effect_alliance_idx").on(sql.raw("\"allianceId\"")),
    ],
);
