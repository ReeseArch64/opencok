import { sql } from "drizzle-orm";
import { bigint, index, integer, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const new_exped_history = opencok_kingdom.table(
    "new_exped_history",
    {
        "stageId": integer("stageId").default(sql.raw("0")),
        "winServerId": integer("winServerId").default(sql.raw("0")),
        "loseServerId": integer("loseServerId").default(sql.raw("0")),
        "users": varchar("users", { length: 1500 }).default(sql.raw("''")),
        "createTime": bigint("createTime", { mode: "bigint" }).default(sql.raw("0")),
    },
    (_table) => [
        index("new_exped_history_winServerId_index").on(sql.raw("\"winServerId\"")),
        index("new_exped_history_loseServerId_index").on(sql.raw("\"loseServerId\"")),
    ],
);
