// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_device_bind_hide = cokdb1.table("user_device_bind_hide", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "hideUid": legacyText("hideUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_device_bind_hide_PRIMARY", columns: [table["uid"], table["hideUid"]] }),
  uniqueIndex("user_device_bind_hide_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"hideUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
