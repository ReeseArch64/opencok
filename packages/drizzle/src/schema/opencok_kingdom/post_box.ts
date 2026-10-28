import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const post_box = opencok_kingdom.table(
    "post_box",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "from": varchar("from", { length: 255 }).default(sql.raw("''")),
        "name": varchar("name", { length: 255 }).default(sql.raw("''")),
        "publicValue": integer("publicValue"),
        "contents": bytea("contents").notNull(),
        "seal": varchar("seal", { length: 40 }).default(sql.raw("''")),
        "time": bigint("time", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({ name: "post_box_PRIMARY", columns: [table["uid"]] }),
        index("post_box_index_from").on(sql.raw("\"from\"")),
        index("post_box_index_time").on(sql.raw("\"time\"")),
        check("post_box_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
    ],
);
