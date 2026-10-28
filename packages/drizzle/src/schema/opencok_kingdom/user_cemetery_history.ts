import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_cemetery_history = opencok_kingdom.table(
    "user_cemetery_history",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "name": varchar("name", { length: 255 }).notNull(),
        "deadSum": bigint("deadSum", { mode: "bigint" }).notNull(),
        "reviveSum": bigint("reviveSum", { mode: "bigint" }).notNull(),
        "useItemSum": integer("useItemSum").notNull(),
        "mainBuildingLevel": integer("mainBuildingLevel").notNull(),
        "rechargeSum": integer("rechargeSum").notNull(),
    },
    (table) => [primaryKey({ name: "user_cemetery_history_PRIMARY", columns: [table["uid"]] })],
);
