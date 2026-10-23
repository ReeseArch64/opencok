// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const ob_record = cokdb1.table("ob_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "allianceIds": legacyText("allianceIds", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "begin": bigint("begin", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "serverId": integer("serverId").notNull().default(sql.raw("0")),
  "areaId": integer("areaId").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "ob_record_PRIMARY", columns: [table["uid"], table["allianceIds"]] }),
  uniqueIndex("ob_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"allianceIds\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("ob_record_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"serverId\""), sql.raw("\"areaId\"")),
]);
