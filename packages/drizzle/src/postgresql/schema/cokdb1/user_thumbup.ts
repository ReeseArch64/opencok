// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_thumbup = cokdb1.table("user_thumbup", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "para1": legacyText("para1", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_thumbup_PRIMARY", columns: [table["uid"], table["type"], table["para1"]] }),
  uniqueIndex("user_thumbup_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\""), sql.raw("rtrim(\"para1\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_thumbup_type").on(sql.raw("\"type\"")),
]);
