// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_new_resource_log = cokdb1.table("user_new_resource_log", {
  "uuid": bigint("uuid", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({ name: "user_new_resource_log_uuid_seq", startWith: 2311 }),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "actionType": integer("actionType").notNull(),
  "sandstone": bigint("sandstone", { mode: "bigint" }).default(sql.raw("0")),
  "diamondstone": bigint("diamondstone", { mode: "bigint" }).default(sql.raw("0")),
  "marble": bigint("marble", { mode: "bigint" }).default(sql.raw("0")),
  "granite": bigint("granite", { mode: "bigint" }).default(sql.raw("0")),
  "limestone": bigint("limestone", { mode: "bigint" }).default(sql.raw("0")),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_new_resource_log_PRIMARY", columns: [table["uuid"]] }),
  index("user_new_resource_log_uid_index").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
