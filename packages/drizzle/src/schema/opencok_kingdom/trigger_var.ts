import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const trigger_var = opencok_kingdom.table(
    "trigger_var",
    {
        "type": integer("type").notNull(),
        "uid": varchar("uid", { length: 50 }).notNull().default(sql.raw("''''''")),
        "key": varchar("key", { length: 200 }).notNull(),
        "value": text("value").notNull(),
        "refreshtime": bigint("refreshtime", { mode: "bigint" }).notNull().default(sql.raw("0")),
        "createTime": text("createTime")
            .notNull()
            .default(
                sql.raw(
                    "to_char(statement_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS')",
                ),
            ),
        "lastUpdateTime": text("lastUpdateTime").notNull().default(
            sql.raw("'0000-00-00 00:00:00'"),
        ),
    },
    (table) => [
        primaryKey({
            name: "trigger_var_PRIMARY",
            columns: [table["type"], table["uid"], table["key"]],
        }),
        index("trigger_var_type_key").on(sql.raw("\"type\""), sql.raw("\"key\"")),
        index("trigger_var_uid").on(sql.raw("\"uid\"")),
        index("trigger_var_createTime").on(sql.raw("\"createTime\"")),
        index("trigger_var_lastUpdateTime").on(sql.raw("\"lastUpdateTime\"")),
        check(
            "trigger_var_createTime_temporal",
            sql.raw(
                "(\"createTime\" IS NULL OR (CASE WHEN \"createTime\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left(\"createTime\",4) <> '0000' AND substring(\"createTime\",6,2) <> '00' AND substring(\"createTime\",9,2) <> '00' THEN to_char(to_date(left(\"createTime\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"createTime\",10) ELSE true END ELSE false END))",
            ),
        ),
        check(
            "trigger_var_lastUpdateTime_temporal",
            sql.raw(
                "(\"lastUpdateTime\" IS NULL OR (CASE WHEN \"lastUpdateTime\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left(\"lastUpdateTime\",4) <> '0000' AND substring(\"lastUpdateTime\",6,2) <> '00' AND substring(\"lastUpdateTime\",9,2) <> '00' THEN to_char(to_date(left(\"lastUpdateTime\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"lastUpdateTime\",10) ELSE true END ELSE false END))",
            ),
        ),
    ],
);
