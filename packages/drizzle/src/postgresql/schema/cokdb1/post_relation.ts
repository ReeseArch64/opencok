// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const post_relation = cokdb1.table("post_relation", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "publicValue": legacyText("publicValue", {"sqlType":"character varying(600)","collation":"legacy_meta.ci"}),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "players": legacyText("players", {"sqlType":"character varying(600)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "post_relation_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("post_relation_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("post_relation_index_time").on(sql.raw("\"time\"")),
]);
