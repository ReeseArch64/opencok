import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const server_update_suggestion = opencok_kingdom.table(
  "server_update_suggestion",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "updateId": varchar("updateId", { length: 255 }).notNull(),
    "idx": integer("idx").notNull(),
    "suggestion": bytea("suggestion"),
    "real_uid": varchar("real_uid", { length: 255 }),
    "server": integer("server"),
    "real_name": varchar("real_name", { length: 255 }),
    "reward_status": integer("reward_status").default(sql.raw("0")),
    "createTime": bigint("createTime", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [
    primaryKey({
      name: "server_update_suggestion_PRIMARY",
      columns: [table["uid"], table["updateId"], table["idx"]],
    }),
    check(
      "server_update_suggestion_suggestion_length",
      sql.raw('octet_length("suggestion") <= 65535'),
    ),
  ],
);
