// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const role_permission = cokdb1.table("role_permission", {
  "role_id": integer("role_id").notNull(),
  "module_permission": legacyText("module_permission", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "route_permission": legacyText("route_permission", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
  "method_permission": legacyText("method_permission", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "role_permission_PRIMARY", columns: [table["role_id"], table["module_permission"]] }),
  uniqueIndex("role_permission_PRIMARY_pad").on(sql.raw("\"role_id\""), sql.raw("rtrim(\"module_permission\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
