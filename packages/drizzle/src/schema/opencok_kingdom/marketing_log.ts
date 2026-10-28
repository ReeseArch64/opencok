import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const marketing_log = opencok_kingdom.table(
    "marketing_log",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "id": varchar("id", { length: 255 }).notNull(),
        "network": varchar("network", { length: 255 }).notNull().default(sql.raw("''")),
        "time": bigint("time", { mode: "bigint" }),
        "deviceId": varchar("deviceId", { length: 255 }),
    },
    (table) => [
        primaryKey({
            name: "marketing_log_PRIMARY",
            columns: [table["uid"], table["id"], table["network"]],
        }),
    ],
);
