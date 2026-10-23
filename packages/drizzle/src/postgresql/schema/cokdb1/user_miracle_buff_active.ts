// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_miracle_buff_active = cokdb1.table("user_miracle_buff_active", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "level": smallint("level"),
}, (table) => [
  primaryKey({ name: "user_miracle_buff_active_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_miracle_buff_active_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
