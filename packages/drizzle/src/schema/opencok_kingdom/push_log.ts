import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const push_log = opencok_kingdom.table(
    "push_log",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
        "message": varchar("message", { length: 100 }),
        "status": integer("status"),
    },
    (table) => [primaryKey({ name: "push_log_PRIMARY", columns: [table["uid"], table["time"]] })],
);
