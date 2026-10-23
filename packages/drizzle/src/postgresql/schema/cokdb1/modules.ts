// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const modules = cokdb1.table("modules", {
  "module_id": integer("module_id").notNull().generatedByDefaultAsIdentity({ name: "modules_module_id_seq", startWith: 1 }),
  "module_name": legacyText("module_name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "module_flag": legacyText("module_flag", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "app_id": legacyText("app_id", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "group_name": legacyText("group_name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "modules_PRIMARY", columns: [table["module_id"]] }),
]);
