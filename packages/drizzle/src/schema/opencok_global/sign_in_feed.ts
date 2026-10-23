import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const sign_in_feed = opencok_global.table(
  "sign_in_feed",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "type": integer("type").notNull().default(sql.raw("0")),
    "feed": varchar("feed", { length: 40 }).notNull(),
    "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [
    primaryKey({
      name: "sign_in_feed_PRIMARY",
      columns: [table["feed"], table["type"], table["uid"]],
    }),
    index("sign_in_feed_index_uid_time").on(sql.raw('"uid"'), sql.raw('"time"')),
  ],
);
