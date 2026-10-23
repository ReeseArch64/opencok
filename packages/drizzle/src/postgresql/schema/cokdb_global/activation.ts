// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const activation = cokdb_global.table("activation", {
  "code": legacyText("code", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "series": integer("series"),
  "type": integer("type").default(sql.raw("0")),
  "user": legacyText("user", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "useTime": bigint("useTime", { mode: "bigint" }),
  "state": integer("state").default(sql.raw("0")),
  "timeId": integer("timeId").default(sql.raw("0")),
  "count": integer("count").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "activation_PRIMARY", columns: [table["code"]] }),
  uniqueIndex("activation_PRIMARY_pad").on(sql.raw("rtrim(\"code\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("activation_index_user").on(sql.raw("rtrim(\"user\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
