import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const protect_total = opencok_kingdom.table(
    "protect_total",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "total": integer("total").default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "protect_total_PRIMARY", columns: [table["uid"]] })],
);
