import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const kingdom_position_appoint = opencok_kingdom.table(
    "kingdom_position_appoint",
    {
        "positionId": integer("positionId").notNull().default(sql.raw("0")),
        "appointTime": bigint("appointTime", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "kingdom_position_appoint_PRIMARY", columns: [table["positionId"]] }),
    ],
);
