// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_comment = cokdb1.table("alliance_comment", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "time": bigint("time", { mode: "bigint" }),
  "senderUid": legacyText("senderUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "senderAllianceId": legacyText("senderAllianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "message": legacyBytes("message"),
  "lang": legacyText("lang", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "type": integer("type"),
  "name": legacyText("name", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "abbr": legacyText("abbr", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "icon": legacyText("icon", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "username": legacyText("username", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "userpic": legacyText("userpic", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "alliance_comment_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_comment_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_comment_index_allianceId").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("alliance_comment_message_length", sql.raw("octet_length(\"message\") <= 65535")),
]);
