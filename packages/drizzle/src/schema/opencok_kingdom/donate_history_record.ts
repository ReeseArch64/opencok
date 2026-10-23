import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const donate_history_record = opencok_kingdom.table(
  "donate_history_record",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "allianceId": varchar("allianceId", { length: 255 }),
    "donate": integer("donate").default(sql.raw("0")),
    "progress": integer("progress"),
    "donateTime": bigint("donateTime", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({ name: "donate_history_record_PRIMARY", columns: [table["uid"]] }),
    index("donate_history_record_aid_idx").on(sql.raw('"allianceId"')),
    index("donate_history_record_time_idx").on(sql.raw('"donateTime"')),
    index("donate_history_record_progress_idx").on(sql.raw('"progress"')),
    index("donate_history_record_donate_idx").on(sql.raw('"donate"')),
  ],
);
