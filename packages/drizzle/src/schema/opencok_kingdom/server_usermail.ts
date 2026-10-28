import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const server_usermail = opencok_kingdom.table(
    "server_usermail",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "toUser": varchar("toUser", { length: 40 }).notNull(),
        "sendBy": varchar("sendBy", { length: 40 }).notNull(),
        "sendTime": bigint("sendTime", { mode: "bigint" }).notNull(),
        "title": varchar("title", { length: 40 }),
        "contents": bytea("contents"),
        "reward": bytea("reward"),
        "rewardStatus": integer("rewardStatus"),
    },
    (table) => [
        primaryKey({ name: "server_usermail_PRIMARY", columns: [table["uid"]] }),
        index("server_usermail_index_sendTime").on(sql.raw("\"sendTime\"")),
        check("server_usermail_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
        check("server_usermail_reward_length", sql.raw("octet_length(\"reward\") <= 65535")),
    ],
);
