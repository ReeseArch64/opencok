import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_region_recall = opencok_kingdom.table(
    "user_region_recall",
    {
        "uid": varchar("uid", { length: 32 }).notNull().default(sql.raw("''")),
        "level": integer("level"),
        "ladder": integer("ladder"),
        "receivedaynum": integer("receivedaynum"),
        "receivetime": bigint("receivetime", { mode: "bigint" }),
        "begintime": bigint("begintime", { mode: "bigint" }),
        "endtime": bigint("endtime", { mode: "bigint" }),
        "country": varchar("country", { length: 32 }).notNull().default(sql.raw("''")),
        "reward": varchar("reward", { length: 255 }).notNull().default(sql.raw("''")),
    },
    (table) => [primaryKey({ name: "user_region_recall_PRIMARY", columns: [table["uid"]] })],
);
