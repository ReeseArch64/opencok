// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const inviter = cokdb1.table("inviter", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "inviteeUid": legacyText("inviteeUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "gold": bigint("gold", { mode: "bigint" }),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "inviter_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("inviter_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("inviter_inviter_index_001").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\""), sql.raw("\"time\"")),
  index("inviter_uid_type_inviteeUid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"inviteeUid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
]);
