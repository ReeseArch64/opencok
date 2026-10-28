import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const push_record = opencok_kingdom.table(
    "push_record",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "time": bigint("time", { mode: "bigint" }).notNull(),
        "type": varchar("type", { length: 10 }).default(sql.raw("'0'")),
        "msg": bytea("msg"),
        "status": integer("status").default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "push_record_PRIMARY", columns: [table["uid"], table["time"]] }),
        index("push_record_index_type").on(sql.raw("\"type\"")),
        check("push_record_msg_length", sql.raw("octet_length(\"msg\") <= 65535")),
    ],
);
