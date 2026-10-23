// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const server_merge_task = cokdb_global.table("server_merge_task", {
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "src_server": legacyText("src_server", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "dst_server": legacyText("dst_server", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "merge_reason": legacyText("merge_reason", {"sqlType":"text","collation":"legacy_meta.ci"}).notNull(),
  "apply_time": bigint("apply_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "merge_time": bigint("merge_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "state": integer("state").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "server_merge_task_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("server_merge_task_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
