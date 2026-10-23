// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const specialreward = cokdb_global.table("specialreward", {
  "gameuid": legacyText("gameuid", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "type": legacyText("type", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "state": integer("state").default(sql.raw("0")),
  "sendTime": bigint("sendTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "specialreward_PRIMARY", columns: [table["gameuid"], table["type"]] }),
  uniqueIndex("specialreward_PRIMARY_pad").on(sql.raw("rtrim(\"gameuid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"type\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
