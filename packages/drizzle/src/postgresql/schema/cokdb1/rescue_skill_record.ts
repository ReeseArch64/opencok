// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const rescue_skill_record = cokdb1.table("rescue_skill_record", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "marchUuid": legacyText("marchUuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "targetUid": legacyText("targetUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "marchType": integer("marchType"),
  "targetType": integer("targetType"),
  "attackTime": bigint("attackTime", { mode: "bigint" }),
  "returnTime": bigint("returnTime", { mode: "bigint" }).default(sql.raw("0")),
  "activate": integer("activate").default(sql.raw("0")),
  "saved": integer("saved").default(sql.raw("0")),
  "attack": integer("attack").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "rescue_skill_record_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("rescue_skill_record_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("rescue_skill_record_uid_idx").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("rescue_skill_record_tuid_idx").on(sql.raw("rtrim(\"targetUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("rescue_skill_record_att_time_idx").on(sql.raw("\"attackTime\"")),
  index("rescue_skill_record_return_time_idx").on(sql.raw("\"returnTime\"")),
  index("rescue_skill_record_muid_idx").on(sql.raw("rtrim(\"marchUuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
