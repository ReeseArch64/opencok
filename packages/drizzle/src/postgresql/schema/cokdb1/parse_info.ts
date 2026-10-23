// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const parse_info = cokdb1.table("parse_info", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "status": integer("status").notNull(),
  "audio": integer("audio").notNull().default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "parse_info_PRIMARY", columns: [table["uid"], table["type"]] }),
  uniqueIndex("parse_info_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
]);
