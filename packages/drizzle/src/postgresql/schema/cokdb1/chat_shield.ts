// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const chat_shield = cokdb1.table("chat_shield", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "owner": legacyText("owner", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "other": legacyText("other", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "chat_shield_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("chat_shield_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("chat_shield_owner_other_index").on(sql.raw("rtrim(\"owner\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"other\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
