import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_territory_fix_log = opencok_kingdom.table(
    "alliance_territory_fix_log",
    {
        "uuid": varchar("uuid", { length: 255 }).notNull(),
        "pointId": integer("pointId").notNull(),
        "territoryId": varchar("territoryId", { length: 255 }).notNull(),
        "territoryType": integer("territoryType").notNull(),
        "playerId": varchar("playerId", { length: 255 }),
        "runTime": bigint("runTime", { mode: "bigint" }).notNull(),
    },
    (
        table,
    ) => [primaryKey({ name: "alliance_territory_fix_log_PRIMARY", columns: [table["uuid"]] })],
);
