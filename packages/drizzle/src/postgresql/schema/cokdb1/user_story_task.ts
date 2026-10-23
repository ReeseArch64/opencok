// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_story_task = cokdb1.table("user_story_task", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "id": integer("id").notNull(),
  "type": integer("type").notNull(),
  "num": integer("num"),
  "state": integer("state"),
}, (table) => [
  primaryKey({ name: "user_story_task_PRIMARY", columns: [table["uid"], table["id"]] }),
  uniqueIndex("user_story_task_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"id\"")),
]);
