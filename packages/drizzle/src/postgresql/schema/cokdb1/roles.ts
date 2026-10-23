// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const roles = cokdb1.table("roles", {
  "role_id": integer("role_id").notNull().generatedByDefaultAsIdentity({ name: "roles_role_id_seq", startWith: 1 }),
  "role_name": legacyText("role_name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "role_flag": legacyText("role_flag", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "roles_PRIMARY", columns: [table["role_id"]] }),
]);
