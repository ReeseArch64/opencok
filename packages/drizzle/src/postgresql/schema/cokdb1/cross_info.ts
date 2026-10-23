// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const cross_info = cokdb1.table("cross_info", {
  "uid": legacyText("uid", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "changeServerType": legacyText("changeServerType", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "crossTime": bigint("crossTime", { mode: "bigint" }).default(sql.raw("0")),
  "targetServerId": integer("targetServerId").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "cross_info_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("cross_info_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
