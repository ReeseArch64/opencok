// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_resource_bind = cokdb1.table("user_resource_bind", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "wood": integer("wood"),
  "food": integer("food"),
  "stone": integer("stone"),
  "iron": integer("iron"),
  "count": integer("count"),
}, (table) => [
  primaryKey({ name: "user_resource_bind_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_resource_bind_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
