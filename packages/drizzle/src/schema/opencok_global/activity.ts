import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const activity = opencok_global.table(
    "activity",
    {
        "id": bigint("id", { mode: "number" }).notNull(),
        "name": varchar("name", { length: 40 }),
        "type": integer("type").notNull(),
        "openTime": bigint("openTime", { mode: "bigint" }),
        "startTime": bigint("startTime", { mode: "bigint" }),
        "endTime": bigint("endTime", { mode: "bigint" }),
        "info1": varchar("info1", { length: 60 }),
    },
    (table) => [
        primaryKey({ name: "activity_PRIMARY", columns: [table["id"]] }),
        check("activity_id_range", sql.raw("\"id\" >= 0 AND \"id\" <= 4294967295")),
    ],
);
