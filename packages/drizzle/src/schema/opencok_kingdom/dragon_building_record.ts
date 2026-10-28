import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const dragon_building_record = opencok_kingdom.table(
    "dragon_building_record",
    {
        "uuid": varchar("uuid", { length: 255 }).notNull(),
        "worldId": integer("worldId").notNull(),
        "buildId": varchar("buildId", { length: 255 }).notNull(),
        "ownerUid": varchar("ownerUid", { length: 255 }).notNull(),
        "occupyUidsStr": varchar("occupyUidsStr", { length: 255 }).notNull(),
        "lastCalcScoreTime": bigint("lastCalcScoreTime", { mode: "bigint" }).notNull(),
        "lastHandKnightTime": integer("lastHandKnightTime").default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "dragon_building_record_PRIMARY", columns: [table["uuid"]] })],
);
