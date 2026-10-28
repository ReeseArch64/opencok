import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_hospital = opencok_kingdom.table(
    "user_hospital",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "armyId": varchar("armyId", { length: 20 }).notNull(),
        "dead": integer("dead").notNull().default(sql.raw("0")),
        "heal": integer("heal").notNull().default(sql.raw("0")),
        "finishTime": bigint("finishTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "user_hospital_PRIMARY", columns: [table["uid"], table["armyId"]] }),
    ],
);
