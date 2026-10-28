import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const alliance = opencok_global.table(
    "alliance",
    {
        "allianceId": varchar("allianceId", { length: 100 }).notNull(),
        "alliancename": varchar("alliancename", { length: 255 }),
        "serverId": integer("serverId"),
    },
    (table) => [
        primaryKey({ name: "alliance_PRIMARY", columns: [table["allianceId"]] }),
        index("alliance_alliancename_index").on(sql.raw("\"alliancename\"")),
        index("alliance_name_idx").on(sql.raw("\"alliancename\"")),
    ],
);
