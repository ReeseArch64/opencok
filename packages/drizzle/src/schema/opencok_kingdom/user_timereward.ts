import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const user_timereward = opencok_kingdom.table(
    "user_timereward",
    {
        "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
        "level": integer("level").default(sql.raw("0")),
        "times": integer("times").default(sql.raw("0")),
        "refreshTime": bigint("refreshTime", { mode: "bigint" }).default(sql.raw("0")),
        "receiveTime": bigint("receiveTime", { mode: "bigint" }).default(sql.raw("0")),
        "rewardInfo": bytea("rewardInfo"),
    },
    (table) => [
        primaryKey({ name: "user_timereward_PRIMARY", columns: [table["uid"]] }),
        check(
            "user_timereward_rewardInfo_length",
            sql.raw("octet_length(\"rewardInfo\") <= 65535"),
        ),
    ],
);
