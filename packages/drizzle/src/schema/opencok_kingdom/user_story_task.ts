import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_story_task = opencok_kingdom.table(
    "user_story_task",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "id": integer("id").notNull(),
        "type": integer("type").notNull(),
        "num": integer("num"),
        "state": integer("state"),
    },
    (table) => [
        primaryKey({ name: "user_story_task_PRIMARY", columns: [table["uid"], table["id"]] }),
    ],
);
