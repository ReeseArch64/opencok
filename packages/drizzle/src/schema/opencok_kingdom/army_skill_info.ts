import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const army_skill_info = opencok_kingdom.table(
    "army_skill_info",
    {
        "uuid": varchar("uuid", { length: 40 }).notNull(),
        "uid": varchar("uid", { length: 40 }).notNull(),
        "armyId": varchar("armyId", { length: 20 }).notNull(),
        "skillId": varchar("skillId", { length: 20 }).notNull(),
        "level": integer("level").notNull(),
        "exp": integer("exp").notNull(),
    },
    (table) => [
        primaryKey({ name: "army_skill_info_PRIMARY", columns: [table["uuid"]] }),
        index("army_skill_info_uid").on(sql.raw("\"uid\"")),
    ],
);
