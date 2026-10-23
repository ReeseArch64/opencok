// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_help = cokdb1.table("alliance_help", {
  "helpId": legacyText("helpId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "senderId": legacyText("senderId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "content": legacyText("content", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "isvalid": integer("isvalid").default(sql.raw("1")),
  "maxcount": integer("maxcount").default(sql.raw("0")),
  "nowcount": integer("nowcount").default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "reduceSec": integer("reduceSec"),
  "itemId": legacyText("itemId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "level": integer("level"),
  "type": integer("type"),
  "helpers": legacyBytes("helpers"),
  "star": integer("star").default(sql.raw("0")),
  "progress": integer("progress").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_help_PRIMARY", columns: [table["helpId"]] }),
  uniqueIndex("alliance_help_PRIMARY_pad").on(sql.raw("rtrim(\"helpId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_help_allianceId_index").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_help_index_alliance_help").on(sql.raw("rtrim(\"content\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("alliance_help_helpers_length", sql.raw("octet_length(\"helpers\") <= 65535")),
]);
