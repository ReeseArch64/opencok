import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const move_server_record_2024_11 = opencok_kingdom.table(
    "move_server_record_2024_11",
    {
        "uuid": varchar("uuid", { length: 40 }).notNull().default(sql.raw("''")),
        "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
        "name": varchar("name", { length: 40 }),
        "src": integer("src").notNull(),
        "dst": integer("dst").notNull(),
        "time": bigint("time", { mode: "bigint" }),
    },
    (
        table,
    ) => [primaryKey({ name: "move_server_record_2024_11_PRIMARY", columns: [table["uuid"]] })],
);
