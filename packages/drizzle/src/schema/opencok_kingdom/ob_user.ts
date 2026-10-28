import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const ob_user = opencok_kingdom.table(
    "ob_user",
    {
        "uid": varchar("uid", { length: 50 }).notNull(),
        "worldId": integer("worldId"),
        "param1": varchar("param1", { length: 200 }),
        "createTime": bigint("createTime", { mode: "bigint" }),
    },
    (table) => [primaryKey({ name: "ob_user_PRIMARY", columns: [table["uid"]] })],
);
