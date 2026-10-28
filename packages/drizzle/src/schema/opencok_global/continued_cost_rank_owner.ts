import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const continued_cost_rank_owner = opencok_global.table(
    "continued_cost_rank_owner",
    {
        kingdomId: integer("kingdomId").notNull(),
        ownerEpoch: bigint("ownerEpoch", { mode: "bigint" }).notNull(),
        instanceId: varchar("instanceId", { length: 40 }).notNull(),
        sequence: bigint("sequence", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({ name: "continued_cost_rank_owner_PRIMARY", columns: [table.kingdomId] }),
        check(
            "continued_cost_rank_owner_bounds",
            sql.raw("\"kingdomId\">0 AND \"ownerEpoch\">0 AND \"sequence\">=0"),
        ),
    ],
);
