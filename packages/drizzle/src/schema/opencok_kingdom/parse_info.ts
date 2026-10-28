import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const parse_info = opencok_kingdom.table(
    "parse_info",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "type": integer("type").notNull(),
        "status": integer("status").notNull(),
        "audio": integer("audio").notNull().default(sql.raw("1")),
    },
    (table) => [primaryKey({ name: "parse_info_PRIMARY", columns: [table["uid"], table["type"]] })],
);
