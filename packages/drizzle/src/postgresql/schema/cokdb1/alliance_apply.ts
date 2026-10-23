// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_apply = cokdb1.table("alliance_apply", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "userId": legacyText("userId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "message": legacyBytes("message"),
  "type": integer("type"),
  "applyTime": bigint("applyTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_apply_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_apply_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_apply_index_user").on(sql.raw("rtrim(\"userId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_apply_index_alliance").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_apply_index_time").on(sql.raw("\"applyTime\"")),
  check("alliance_apply_message_length", sql.raw("octet_length(\"message\") <= 65535")),
]);
