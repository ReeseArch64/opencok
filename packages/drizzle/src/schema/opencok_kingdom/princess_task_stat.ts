import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const princess_task_stat = opencok_kingdom.table(
    "princess_task_stat",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "time": bigint("time", { mode: "bigint" }).notNull(),
        "userId": varchar("userId", { length: 255 }).notNull(),
        "taskId": integer("taskId").notNull(),
        "taskType": integer("taskType").notNull(),
        "acceptTime": bigint("acceptTime", { mode: "bigint" }).notNull(),
        "state": integer("state").notNull(),
        "param1": bigint("param1", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({ name: "princess_task_stat_PRIMARY", columns: [table["uid"]] }),
        index("princess_task_stat_index_type").on(sql.raw("\"state\""), sql.raw("\"taskType\"")),
        index("princess_task_stat_index_param").on(sql.raw("\"state\""), sql.raw("\"param1\"")),
    ],
);
