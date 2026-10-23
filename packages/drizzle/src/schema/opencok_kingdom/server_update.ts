import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const server_update = opencok_kingdom.table(
  "server_update",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "idx": integer("idx").notNull(),
    "content": bytea("content"),
    "chineseContent": bytea("chineseContent"),
    "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "server_update_PRIMARY", columns: [table["uid"], table["idx"]] }),
    check("server_update_content_length", sql.raw('octet_length("content") <= 65535')),
    check(
      "server_update_chineseContent_length",
      sql.raw('octet_length("chineseContent") <= 65535'),
    ),
  ],
);
