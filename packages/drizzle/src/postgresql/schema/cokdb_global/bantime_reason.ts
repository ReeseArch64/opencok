// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const bantime_reason = cokdb_global.table("bantime_reason", {
  "serverId": legacyText("serverId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "uid": legacyText("uid", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "operator": legacyText("operator", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "reason": legacyText("reason", {"sqlType":"character varying(250)","collation":"legacy_meta.ci"}),
  "opeDate": legacyText("opeDate", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "status": integer("status").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "bantime_reason_PRIMARY", columns: [table["serverId"], table["uid"]] }),
  uniqueIndex("bantime_reason_PRIMARY_pad").on(sql.raw("rtrim(\"serverId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
