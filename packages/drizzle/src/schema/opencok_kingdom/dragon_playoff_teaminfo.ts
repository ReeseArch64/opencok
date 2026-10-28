import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const dragon_playoff_teaminfo = opencok_kingdom.table(
    "dragon_playoff_teaminfo",
    {
        "teamId": varchar("teamId", { length: 40 }).notNull(),
        "teamName": varchar("teamName", { length: 255 }),
        "leaderName": varchar("leaderName", { length: 255 }),
        "kingId": integer("kingId").notNull().default(sql.raw("0")),
        "kingName": varchar("kingName", { length: 255 }),
        "state": integer("state").notNull().default(sql.raw("0")),
        "score": integer("score").notNull().default(sql.raw("0")),
        "fighting": integer("fighting").notNull().default(sql.raw("0")),
        "fightNum": integer("fightNum").notNull().default(sql.raw("0")),
        "winNum": integer("winNum").notNull().default(sql.raw("0")),
        "curmember": integer("curmember").notNull().default(sql.raw("0")),
        "maxmember": integer("maxmember").notNull().default(sql.raw("0")),
        "version": integer("version").notNull().default(sql.raw("0")),
        "index": integer("index").notNull().default(sql.raw("0")),
        "fightServerId": varchar("fightServerId", { length: 40 }),
        "rankNum": integer("rankNum").notNull().default(sql.raw("0")),
        "areaId": integer("areaId").notNull().default(sql.raw("0")),
        "abbr": varchar("abbr", { length: 255 }),
        "fightState": integer("fightState").notNull().default(sql.raw("0")),
        "serverId": integer("serverId").notNull().default(sql.raw("0")),
        "icon": varchar("icon", { length: 255 }),
        "groupId": integer("groupId").notNull().default(sql.raw("0")),
        "groupIndex": integer("groupIndex").notNull().default(sql.raw("0")),
        "timeIndexes": varchar("timeIndexes", { length: 20 }),
        "enemyIds": varchar("enemyIds", { length: 255 }),
        "results": varchar("results", { length: 20 }),
        "curEnemyId": varchar("curEnemyId", { length: 40 }),
        "finalGroupIndex": integer("finalGroupIndex").notNull().default(sql.raw("0")),
        "finalRankNum": integer("finalRankNum").notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({
            name: "dragon_playoff_teaminfo_PRIMARY",
            columns: [table["teamId"], table["version"]],
        }),
    ],
);
