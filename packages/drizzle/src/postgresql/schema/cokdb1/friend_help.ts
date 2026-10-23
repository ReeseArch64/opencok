// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const friend_help = cokdb1.table("friend_help", {
  "fromId": legacyText("fromId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "toId": legacyText("toId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "friend_help_PRIMARY", columns: [table["fromId"], table["toId"]] }),
  uniqueIndex("friend_help_PRIMARY_pad").on(sql.raw("rtrim(\"fromId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"toId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
