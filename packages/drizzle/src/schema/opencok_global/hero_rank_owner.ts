import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const hero_rank_owner = opencok_global.table(
    "hero_rank_owner",
    {
        kingdomId: integer("kingdomId").notNull(),
        ownerEpoch: bigint("ownerEpoch", { mode: "bigint" }).notNull(),
        instanceId: varchar("instanceId", { length: 36 }).notNull(),
        sequence: bigint("sequence", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "hero_rank_owner_PRIMARY", columns: [table.kingdomId] }),
        check(
            "hero_rank_owner_bounds",
            sql.raw("\"kingdomId\" > 0 AND \"ownerEpoch\" > 0 AND \"sequence\" >= 0"),
        ),
    ],
);
