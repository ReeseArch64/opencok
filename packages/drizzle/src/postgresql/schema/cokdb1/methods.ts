// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const methods = cokdb1.table("methods", {
  "method_id": integer("method_id").notNull(),
  "route_id": integer("route_id"),
  "method_name": legacyText("method_name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "method_path": legacyText("method_path", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "methods_PRIMARY", columns: [table["method_id"]] }),
]);
