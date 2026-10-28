import { sql } from "drizzle-orm";
import { bigint, doublePrecision, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_neutral = opencok_kingdom.table(
    "user_neutral",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "serverid": integer("serverid").default(sql.raw("0")),
        "collectload": integer("collectload").default(sql.raw("0")),
        "collecttime": bigint("collecttime", { mode: "bigint" }).default(sql.raw("0")),
        "score": doublePrecision("score").default(sql.raw("0")),
        "leaveTime": bigint("leaveTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "user_neutral_PRIMARY", columns: [table["uid"]] })],
);
