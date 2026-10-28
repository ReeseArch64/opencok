import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const logaction = opencok_kingdom.table(
    "logaction",
    {
        "uid": varchar("uid", { length: 50 }).notNull(),
        "user": varchar("user", { length: 200 }).notNull(),
        "timeStamp": bigint("timeStamp", { mode: "bigint" }).notNull(),
        "action": varchar("action", { length: 50 }).notNull(),
        "code": varchar("code", { length: 100 }).notNull(),
        "info": varchar("info", { length: 2048 }).notNull(),
        "param": bytea("param"),
    },
    (table) => [
        primaryKey({ name: "logaction_PRIMARY", columns: [table["uid"]] }),
        index("logaction_index").on(
            sql.raw("\"timeStamp\""),
            sql.raw("\"user\""),
            sql.raw("\"action\""),
            sql.raw("\"code\""),
        ),
        index("logaction_index2").on(
            sql.raw("\"user\""),
            sql.raw("\"timeStamp\""),
            sql.raw("\"action\""),
        ),
        check("logaction_param_length", sql.raw("octet_length(\"param\") <= 65535")),
    ],
);
