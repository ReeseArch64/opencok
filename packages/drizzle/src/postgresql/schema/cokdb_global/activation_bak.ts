// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const activation_bak = cokdb_global.table("activation_bak", {
  "code": legacyText("code", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "series": integer("series"),
  "user": legacyText("user", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "state": integer("state").default(sql.raw("0")),
});
