import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const mail_gift_opening = opencok_kingdom.table(
  "mail_gift_opening",
  {
    mailUid: varchar("mailUid", { length: 40 }).notNull(),
    sendTime: bigint("sendTime", { mode: "bigint" }).notNull(),
    toUser: varchar("toUser", { length: 40 }).notNull(),
    openedAt: bigint("openedAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "mail_gift_opening_PRIMARY", columns: [table.mailUid, table.sendTime] }),
    index("mail_gift_opening_pending").on(table.openedAt, table.mailUid, table.sendTime),
    check("mail_gift_opening_time_nonnegative", sql.raw('"openedAt" >= 0')),
  ],
);
