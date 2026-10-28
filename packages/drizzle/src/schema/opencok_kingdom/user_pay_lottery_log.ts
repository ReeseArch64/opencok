import { bigint, integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_pay_lottery_log = opencok_kingdom.table(
    "user_pay_lottery_log",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "userId": varchar("userId", { length: 40 }),
        "name": varchar("name", { length: 40 }),
        "activityId": varchar("activityId", { length: 40 }).notNull(),
        "spend": numeric("spend", { precision: 10, scale: 2, mode: "number" }),
        "itemId": varchar("itemId", { length: 10 }),
        "gold": integer("gold"),
        "time": bigint("time", { mode: "bigint" }),
    },
    (table) => [primaryKey({ name: "user_pay_lottery_log_PRIMARY", columns: [table["uid"]] })],
);
