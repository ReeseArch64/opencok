import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const mail_contents_20141030 = opencok_kingdom.table(
    "mail_contents_20141030",
    {
        "id": varchar("id", { length: 40 }).notNull(),
        "title": varchar("title", { length: 40 }).notNull(),
        "contents": bytea("contents").notNull(),
        "rewardId": bytea("rewardId"),
        "itemIdFlag": integer("itemIdFlag").default(sql.raw("0")),
        "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({ name: "mail_contents_20141030_PRIMARY", columns: [table["id"]] }),
        check(
            "mail_contents_20141030_contents_length",
            sql.raw("octet_length(\"contents\") <= 65535"),
        ),
        check(
            "mail_contents_20141030_rewardId_length",
            sql.raw("octet_length(\"rewardId\") <= 65535"),
        ),
    ],
);
