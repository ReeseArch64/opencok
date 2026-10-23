import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const invite_count = opencok_kingdom.table(
  "invite_count",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "count": integer("count").default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "invite_count_PRIMARY", columns: [table["uid"]] })],
);
