import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const flower_notice = opencok_kingdom.table(
    "flower_notice",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "addTime": bigint("addTime", { mode: "bigint" }),
        "targetID": varchar("targetID", { length: 255 }),
        "sourceName": varchar("sourceName", { length: 255 }),
        "sourceID": varchar("sourceID", { length: 255 }),
        "itemID": varchar("itemID", { length: 255 }),
        "itemCount": integer("itemCount"),
    },
    (table) => [primaryKey({ name: "flower_notice_PRIMARY", columns: [table["uid"]] })],
);
