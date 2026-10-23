// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const client_log = cokdb1.table("client_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "keyword": legacyText("keyword", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "client_log_PRIMARY", columns: [table["uid"], table["type"], table["keyword"], table["time"]] }),
  uniqueIndex("client_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\""), sql.raw("rtrim(\"keyword\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
]);
