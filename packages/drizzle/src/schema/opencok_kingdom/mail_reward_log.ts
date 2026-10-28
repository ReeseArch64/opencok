import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const mail_reward_log = opencok_kingdom.table(
    "mail_reward_log",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "mailId": varchar("mailId", { length: 40 }).notNull(),
        "type": integer("type"),
        "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
        "status": smallint("status"),
    },
    (table) => [
        primaryKey({
            name: "mail_reward_log_PRIMARY",
            columns: [table["uid"], table["mailId"], table["createTime"]],
        }),
        check("mail_reward_log_status_range", sql.raw("\"status\" BETWEEN -128 AND 127")),
    ],
);
