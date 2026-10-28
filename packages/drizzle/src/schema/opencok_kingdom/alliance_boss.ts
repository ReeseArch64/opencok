import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_boss = opencok_kingdom.table(
    "alliance_boss",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "itemNum": integer("itemNum").default(sql.raw("0")),
        "bossLevel": varchar("bossLevel", { length: 255 }),
        "todayCount": integer("todayCount").default(sql.raw("0")),
        "lastChallengeTime": bigint("lastChallengeTime", { mode: "bigint" }).default(sql.raw("0")),
        "bossId": varchar("bossId", { length: 255 }),
        "maxHp": integer("maxHp").default(sql.raw("0")),
        "hp": integer("hp").default(sql.raw("0")),
        "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
        "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
        "power": integer("power").default(sql.raw("0")),
        "rewards": varchar("rewards", { length: 255 }),
        "pointId": integer("pointId").default(sql.raw("0")),
        "attackerNum": integer("attackerNum").default(sql.raw("0")),
        "attackTimes": integer("attackTimes").default(sql.raw("0")),
        "killUser": varchar("killUser", { length: 255 }),
        "lastHurt": integer("lastHurt").default(sql.raw("0")),
        "userAttackInfo": text("userAttackInfo"),
    },
    (table) => [primaryKey({ name: "alliance_boss_PRIMARY", columns: [table["uid"]] })],
);
