import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const sign_in = opencok_kingdom.table(
    "sign_in",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "day": integer("day").default(sql.raw("0")),
        "signInTime": bigint("signInTime", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "sign_in_PRIMARY", columns: [table["uid"]] })],
);
