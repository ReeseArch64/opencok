// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const exception_user = cokdb1.table("exception_user", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "day": legacyText("day", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull(),
  "count": integer("count"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "exception_user_PRIMARY", columns: [table["uid"], table["type"], table["day"]] }),
  uniqueIndex("exception_user_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\""), sql.raw("rtrim(\"day\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
