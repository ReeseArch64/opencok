import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const branch_url = opencok_kingdom.table(
  "branch_url",
  {
    "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
    "serverId": integer("serverId").notNull().default(sql.raw("0")),
    "type": varchar("type", { length: 128 }),
    "data": varchar("data", { length: 255 }),
    "url": varchar("url", { length: 255 }).notNull().default(sql.raw("''")),
    "startTime": bigint("startTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "modifyTime": bigint("modifyTime", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [
    primaryKey({
      name: "branch_url_PRIMARY",
      columns: [table["uid"], table["serverId"], table["url"]],
    }),
    index("branch_url_branch_url_link_index").on(sql.raw('"url"')),
    index("branch_url_branch_url_type_index").on(sql.raw('"type"')),
  ],
);
