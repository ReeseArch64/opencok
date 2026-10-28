import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const server_config = opencok_kingdom.table(
    "server_config",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "stat": integer("stat").notNull().default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "server_config_PRIMARY", columns: [table["uid"]] })],
);
