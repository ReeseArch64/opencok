import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const device_mail_record = opencok_kingdom.table(
    "device_mail_record",
    {
        "deviceId": varchar("deviceId", { length: 40 }).notNull(),
        "record": varchar("record", { length: 40 }).notNull(),
    },
    (table) => [
        primaryKey({
            name: "device_mail_record_PRIMARY",
            columns: [table["deviceId"], table["record"]],
        }),
    ],
);
