import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_luck_draw = opencok_kingdom.table(
    "user_luck_draw",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "type": integer("type").notNull(),
        "count": integer("count"),
        "upTime": bigint("upTime", { mode: "bigint" }),
        "randTime": bigint("randTime", { mode: "bigint" }),
        "reward": varchar("reward", { length: 1000 }),
    },
    (table) => [
        primaryKey({ name: "user_luck_draw_PRIMARY", columns: [table["uid"], table["type"]] }),
    ],
);
