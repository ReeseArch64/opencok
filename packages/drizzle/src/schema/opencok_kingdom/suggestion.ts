import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const suggestion = opencok_kingdom.table(
    "suggestion",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "ownerId": varchar("ownerId", { length: 40 }).notNull(),
        "castlelevel": integer("castlelevel"),
        "contents": bytea("contents").notNull(),
        "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
        "replyContent": bytea("replyContent"),
        "replyTime": bigint("replyTime", { mode: "bigint" }),
    },
    (table) => [
        primaryKey({ name: "suggestion_PRIMARY", columns: [table["uid"]] }),
        index("suggestion_ownerId").on(sql.raw("\"ownerId\"")),
        check("suggestion_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
        check("suggestion_replyContent_length", sql.raw("octet_length(\"replyContent\") <= 65535")),
    ],
);
