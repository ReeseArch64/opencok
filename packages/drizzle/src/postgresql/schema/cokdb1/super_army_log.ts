// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const super_army_log = cokdb1.table("super_army_log", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "castleLevel": integer("castleLevel"),
  "level": integer("level"),
  "createTime": bigint("createTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "super_army_log_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("super_army_log_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("super_army_log_createTime_index").on(sql.raw("\"createTime\"")),
  index("super_army_log_uid_index").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
