// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const usermapping = cokdb_global.table("usermapping", {
  "gameUid": legacyText("gameUid", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "mappingType": legacyText("mappingType", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "mappingValue": legacyText("mappingValue", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "lastTime": bigint("lastTime", { mode: "bigint" }).default(sql.raw("0")),
  "active": integer("active").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "usermapping_PRIMARY", columns: [table["gameUid"], table["mappingType"]] }),
  uniqueIndex("usermapping_PRIMARY_pad").on(sql.raw("rtrim(\"gameUid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"mappingType\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("usermapping_pf_pi_lasttime_index").on(sql.raw("rtrim(\"mappingType\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"mappingValue\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"lastTime\"")),
]);
