// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const push_log = cokdb1.table("push_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "message": legacyText("message", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "status": integer("status"),
}, (table) => [
  primaryKey({ name: "push_log_PRIMARY", columns: [table["uid"], table["time"]] }),
  uniqueIndex("push_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
]);
