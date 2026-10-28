import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const gm_expedition_match = opencok_kingdom.table(
    "gm_expedition_match",
    {
        "serverId": integer("serverId").notNull(),
        "targetServerId": integer("targetServerId").notNull(),
        "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "gm_expedition_match_PRIMARY", columns: [table["serverId"]] })],
);
