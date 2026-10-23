// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_battle_record = cokdb1.table("alliance_battle_record", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "attAllianceId": legacyText("attAllianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "defAllianceId": legacyText("defAllianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "type": integer("type").notNull(),
  "report": legacyBytes("report").notNull(),
  "timeStamp": bigint("timeStamp", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "alliance_battle_record_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("alliance_battle_record_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("alliance_battle_record_report_length", sql.raw("octet_length(\"report\") <= 65535")),
]);
