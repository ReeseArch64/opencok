// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const mod_authorize = cokdb1.table("mod_authorize", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "authorize": integer("authorize").default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "mod_authorize_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("mod_authorize_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
]);
