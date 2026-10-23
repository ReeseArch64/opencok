// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const activation = cokdb1.table("activation", {
  "code": legacyText("code", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "series": integer("series"),
  "user": legacyText("user", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "state": integer("state").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "activation_PRIMARY", columns: [table["code"]] }),
  uniqueIndex("activation_PRIMARY_pad").on(sql.raw("rtrim(\"code\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("activation_index_user").on(sql.raw("rtrim(\"user\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
