// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_permission = cokdb1.table("user_permission", {
  "user_id": integer("user_id").notNull(),
  "module_permission": legacyText("module_permission", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "route_permission": legacyText("route_permission", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
  "method_permission": legacyText("method_permission", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
  "type": smallint("type").notNull(),
}, (table) => [
  primaryKey({ name: "user_permission_PRIMARY", columns: [table["user_id"], table["module_permission"], table["type"]] }),
  uniqueIndex("user_permission_PRIMARY_pad").on(sql.raw("\"user_id\""), sql.raw("rtrim(\"module_permission\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
]);
