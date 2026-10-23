import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const server_push_config = opencok_kingdom.table(
  "server_push_config",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "type": integer("type").default(sql.raw("0")),
    "startTime": bigint("startTime", { mode: "bigint" }),
    "contents": bytea("contents"),
    "state": integer("state"),
  },
  (table) => [
    primaryKey({ name: "server_push_config_PRIMARY", columns: [table["uid"]] }),
    index("server_push_config_index_startTime").on(sql.raw('"startTime"')),
    check("server_push_config_contents_length", sql.raw('octet_length("contents") <= 65535')),
  ],
);
