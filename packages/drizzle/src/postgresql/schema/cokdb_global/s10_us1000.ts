// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const s10_us1000 = cokdb_global.table("s10_us1000", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"C"}).notNull().default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "s10_us1000_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("s10_us1000_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
]);
