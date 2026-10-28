import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const compensation_record_shield = opencok_kingdom.table(
    "compensation_record_shield",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "createTime": bigint("createTime", { mode: "bigint" }).default(sql.raw("0")),
    },
    (
        table,
    ) => [primaryKey({ name: "compensation_record_shield_PRIMARY", columns: [table["uid"]] })],
);
