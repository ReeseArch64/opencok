import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const pay_total_log = opencok_kingdom.table(
    "pay_total_log",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "level": integer("level").notNull(),
        "gold": bigint("gold", { mode: "bigint" }),
        "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
        "type": integer("type").notNull().default(sql.raw("1")),
    },
    (table) => [
        primaryKey({
            name: "pay_total_log_PRIMARY",
            columns: [table["uid"], table["level"], table["createTime"], table["type"]],
        }),
    ],
);
