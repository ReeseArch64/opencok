// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_login_ip = cokdb1.table("user_login_ip", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "ip": legacyText("ip", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "count": integer("count"),
}, (table) => [
  primaryKey({ name: "user_login_ip_PRIMARY", columns: [table["uid"], table["ip"]] }),
  uniqueIndex("user_login_ip_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"ip\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_login_ip_index_uid_count").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"count\"")),
]);
