import { sql } from "drizzle-orm";
import { check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const contact_1 = opencok_kingdom.table(
    "contact_1",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "friendUid": varchar("friendUid", { length: 255 }).notNull(),
        "stat": integer("stat").default(sql.raw("0")),
        "description": bytea("description"),
    },
    (table) => [
        primaryKey({ name: "contact_1_PRIMARY", columns: [table["uid"], table["friendUid"]] }),
        check("contact_1_description_length", sql.raw("octet_length(\"description\") <= 65535")),
    ],
);
