import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const hot_refresh_record = opencok_kingdom.table(
    "hot_refresh_record",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "count": integer("count").default(sql.raw("0")),
        "todayTime": bigint("todayTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "hot_refresh_record_PRIMARY", columns: [table["uid"]] })],
);
