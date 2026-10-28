import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_boss_rank = opencok_kingdom.table(
    "alliance_boss_rank",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "allianceId": varchar("allianceId", { length: 40 }),
        "bossId": varchar("bossId", { length: 40 }),
        "useTime": bigint("useTime", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "alliance_boss_rank_PRIMARY", columns: [table["uid"]] })],
);
