// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const staff = cokdb1.table("staff", {
  "id": integer("id").notNull(),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
}, (table) => [
  primaryKey({ name: "staff_PRIMARY", columns: [table["id"]] }),
]);
