// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_target_task_notes = cokdb1.table("user_target_task_notes", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "version": legacyText("version", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "receive_mode": integer("receive_mode").notNull().default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "beginTime": bigint("beginTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "opendTime": bigint("opendTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "isMail": integer("isMail").notNull().default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_target_task_notes_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_target_task_notes_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
