import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const mail_update = opencok_kingdom.table(
    "mail_update",
    {
        toUser: varchar("toUser", { length: 40 }).notNull(),
        mailUid: varchar("mailUid", { length: 40 }).notNull(),
        updateTime: bigint("updateTime", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({ name: "mail_update_PRIMARY", columns: [table.toUser, table.mailUid] }),
        index("mail_update_owner_time").on(table.toUser, table.updateTime),
        check("mail_update_time_nonnegative", sql.raw("\"updateTime\" >= 0")),
    ],
);
