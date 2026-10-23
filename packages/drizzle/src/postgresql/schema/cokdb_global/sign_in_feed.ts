// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const sign_in_feed = cokdb_global.table("sign_in_feed", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "feed": legacyText("feed", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "sign_in_feed_PRIMARY", columns: [table["feed"], table["type"], table["uid"]] }),
  uniqueIndex("sign_in_feed_PRIMARY_pad").on(sql.raw("rtrim(\"feed\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\""), sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("sign_in_feed_index_uid_time").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
]);
