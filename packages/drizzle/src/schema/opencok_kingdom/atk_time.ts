import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const atk_time = opencok_kingdom.table(
    "atk_time",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "atk_time_PRIMARY", columns: [table["uid"]] })],
);
