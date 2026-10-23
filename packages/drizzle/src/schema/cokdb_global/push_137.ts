import { sql } from "drizzle-orm";
import { check, primaryKey, smallint } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb_global } from "../namespaces";

export const push_137 = cokdb_global.table("push_137", {
  "id": smallint("id").notNull(),
  "time": smallint("time").default(sql.raw("0")),
  "title": bytea("title"),
  "contents": bytea("contents"),
  "reward": bytea("reward"),
  "notification": bytea("notification"),
}, (table) => [
  primaryKey({ name: "push_137_PRIMARY", columns: [table["id"]] }),
  check("push_137_id_range", sql.raw("\"id\" BETWEEN -128 AND 127")),
  check("push_137_title_length", sql.raw("octet_length(\"title\") <= 65535")),
  check("push_137_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
  check("push_137_reward_length", sql.raw("octet_length(\"reward\") <= 65535")),
  check("push_137_notification_length", sql.raw("octet_length(\"notification\") <= 65535")),
]);
