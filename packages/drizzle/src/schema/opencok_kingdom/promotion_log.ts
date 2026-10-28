import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const promotion_log = opencok_kingdom.table(
    "promotion_log",
    {
        "channel": varchar("channel", { length: 100 }).notNull(),
        "statId": varchar("statId", { length: 100 }).notNull(),
        "exchangeId": varchar("exchangeId", { length: 20 }).notNull(),
        "uid": varchar("uid", { length: 40 }).notNull(),
        "adId": varchar("adId", { length: 100 }).default(sql.raw("''")),
        "deviceType": integer("deviceType").default(sql.raw("0")),
        "showTime": bigint("showTime", { mode: "bigint" }),
        "buyTime": bigint("buyTime", { mode: "bigint" }),
        "state": integer("state").default(sql.raw("0")),
        "deviceid": varchar("deviceid", { length: 255 }),
        "accountid": varchar("accountid", { length: 50 }),
        "campaignid": varchar("campaignid", { length: 50 }),
        "adgroupid": varchar("adgroupid", { length: 50 }),
        "creativeid": varchar("creativeid", { length: 50 }),
        "location": varchar("location", { length: 50 }),
    },
    (table) => [
        primaryKey({
            name: "promotion_log_PRIMARY",
            columns: [table["channel"], table["statId"], table["exchangeId"], table["uid"]],
        }),
    ],
);
