import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const dragon_battle_mail_record = opencok_kingdom.table(
    "dragon_battle_mail_record",
    {
        "season_version": integer("season_version").notNull(),
        "version": integer("version").notNull(),
        "uid": varchar("uid", { length: 50 }).notNull(),
        "teamId": varchar("teamId", { length: 50 }).notNull(),
        "fightServer": integer("fightServer").notNull().default(sql.raw("0")),
        "score": integer("score").notNull().default(sql.raw("0")),
        "mailId": integer("mailId").notNull().default(sql.raw("0")),
        "teamScore": integer("teamScore").notNull().default(sql.raw("0")),
        "rewards": varchar("rewards", { length: 2000 }).notNull().default(sql.raw("''''''")),
        "recived": smallint("recived").notNull().default(sql.raw("0")),
        "state": integer("state").notNull().default(sql.raw("0")),
        "win": smallint("win").notNull().default(sql.raw("0")),
        "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({
            name: "dragon_battle_mail_record_PRIMARY",
            columns: [table["uid"], table["season_version"], table["version"]],
        }),
        index("dragon_battle_mail_record_state").on(sql.raw("\"state\"")),
        check(
            "dragon_battle_mail_record_recived_range",
            sql.raw("\"recived\" BETWEEN -128 AND 127"),
        ),
        check("dragon_battle_mail_record_win_range", sql.raw("\"win\" BETWEEN -128 AND 127")),
    ],
);
