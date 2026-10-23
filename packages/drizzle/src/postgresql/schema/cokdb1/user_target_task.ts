// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_target_task = cokdb1.table("user_target_task", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "id": legacyText("id", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "num": integer("num").notNull().default(sql.raw("0")),
  "target_num": integer("target_num").notNull().default(sql.raw("0")),
  "state": integer("state").notNull().default(sql.raw("0")),
  "type_level": integer("type_level").notNull().default(sql.raw("0")),
  "rewardDouble": integer("rewardDouble").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_target_task_PRIMARY", columns: [table["uid"], table["id"]] }),
  uniqueIndex("user_target_task_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
