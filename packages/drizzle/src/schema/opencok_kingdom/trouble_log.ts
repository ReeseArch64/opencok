import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const trouble_log = opencok_kingdom.table(
  "trouble_log",
  {
    uid: varchar("uid", { length: 40 }),
    username: varchar("username", { length: 255 }),
    usetime: bigint("usetime", { mode: "bigint" }),
    statusid: varchar("statusid", { length: 255 }),
    itemid: varchar("itemid", { length: 40 }).notNull().default(sql.raw("''")),
    id: integer("id")
      .notNull()
      .generatedByDefaultAsIdentity({ name: "trouble_log_id_seq", startWith: 1 }),
  },
  (table) => [
    index("trouble_log_trouble_log_uid_index").on(sql.raw('"uid"')),
    primaryKey({ name: "trouble_log_PRIMARY", columns: [table.id] }),
    index("trouble_log_owner").on(table.uid, table.id),
  ],
);
