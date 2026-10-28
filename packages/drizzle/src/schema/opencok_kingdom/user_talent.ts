import { sql } from "drizzle-orm";
import { check, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const user_talent = opencok_kingdom.table(
    "user_talent",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "talent": bytea("talent"),
    },
    (table) => [
        primaryKey({ name: "user_talent_PRIMARY", columns: [table["uid"]] }),
        check("user_talent_talent_length", sql.raw("octet_length(\"talent\") <= 65535")),
    ],
);
