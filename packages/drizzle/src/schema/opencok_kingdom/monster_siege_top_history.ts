import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const monster_siege_top_history = opencok_kingdom.table(
    "monster_siege_top_history",
    {
        "allianceId": varchar("allianceId", { length: 40 }).notNull(),
        "time": bigint("time", { mode: "bigint" }).notNull(),
        "allianceAbbr": varchar("allianceAbbr", { length: 40 }).notNull(),
        "allianceName": varchar("allianceName", { length: 40 }).notNull(),
        "rank": integer("rank").notNull(),
        "killCount": bigint("killCount", { mode: "bigint" }).default(sql.raw("0")),
        "siegeRound": integer("siegeRound").default(sql.raw("0")),
        "validMemberCount": integer("validMemberCount").default(sql.raw("0")),
        "allianceCount": integer("allianceCount").default(sql.raw("0")),
        "activityAllianceCount": integer("activityAllianceCount").default(sql.raw("0")),
        "activity30AllianceCount": integer("activity30AllianceCount").default(sql.raw("0")),
        "activity40AllianceCount": integer("activity40AllianceCount").default(sql.raw("0")),
        "activity50AllianceCount": integer("activity50AllianceCount").default(sql.raw("0")),
        "monsterPerRoundNum": varchar("monsterPerRoundNum", { length: 500 }),
    },
    (table) => [
        primaryKey({
            name: "monster_siege_top_history_PRIMARY",
            columns: [table["allianceId"], table["time"]],
        }),
    ],
);
