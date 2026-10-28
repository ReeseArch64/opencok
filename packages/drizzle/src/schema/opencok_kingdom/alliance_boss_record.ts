import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_boss_record = opencok_kingdom.table(
    "alliance_boss_record",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "allianceId": varchar("allianceId", { length: 40 }),
        "bossId": varchar("bossId", { length: 40 }),
        "maxHp": integer("maxHp").default(sql.raw("0")),
        "hp": integer("hp").default(sql.raw("0")),
        "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
        "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
        "pointId": integer("pointId").default(sql.raw("0")),
        "attackerNum": integer("attackerNum").default(sql.raw("0")),
        "attackTimes": integer("attackTimes").default(sql.raw("0")),
        "killUser": varchar("killUser", { length: 40 }),
        "lastHurt": integer("lastHurt").default(sql.raw("0")),
        "userAttackInfo": text("userAttackInfo"),
    },
    (table) => [primaryKey({ name: "alliance_boss_record_PRIMARY", columns: [table["uid"]] })],
);
