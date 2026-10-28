import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const kingdom_cemetery = opencok_kingdom.table(
    "kingdom_cemetery",
    {
        "id": integer("id")
            .notNull()
            .generatedByDefaultAsIdentity({ "name": "kingdom_cemetery_id_seq", "startWith": 9 }),
        "cemeteryStat": integer("cemeteryStat").default(sql.raw("0")),
        "reviveStat": integer("reviveStat").default(sql.raw("0")),
        "totalContribution": integer("totalContribution").default(sql.raw("0")),
        "totalDead": bigint("totalDead", { mode: "bigint" }).default(sql.raw("0")),
        "kingBlessingTime": bigint("kingBlessingTime", { mode: "bigint" }),
        "ministerBlessingTime": bigint("ministerBlessingTime", { mode: "bigint" }),
        "startReviveTime": bigint("startReviveTime", { mode: "bigint" }),
        "needContributionSum": integer("needContributionSum").default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "kingdom_cemetery_PRIMARY", columns: [table["id"]] })],
);
