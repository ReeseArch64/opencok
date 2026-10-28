import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const princess_task_record = opencok_kingdom.table(
    "princess_task_record",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "refreshNum": integer("refreshNum").default(sql.raw("0")),
        "refreshTime": bigint("refreshTime", { mode: "bigint" }).default(sql.raw("0")),
        "completeNum": integer("completeNum").default(sql.raw("0")),
        "completeTime": bigint("completeTime", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "princess_task_record_PRIMARY", columns: [table["uid"]] })],
);
