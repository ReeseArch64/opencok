import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const chat_report_record = opencok_kingdom.table(
  "chat_report_record",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "lastUpdateTime": bigint("lastUpdateTime", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "chat_report_record_PRIMARY", columns: [table["uid"]] }),
    index("chat_report_record_time_idx").on(sql.raw('"lastUpdateTime"')),
  ],
);
