// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const repeat_name = cokdb_global.table("repeat_name", {
  "gameUid": legacyText("gameUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "gameUserName": legacyText("gameUserName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "server": legacyText("server", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "minServer": legacyText("minServer", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "repeat_name_PRIMARY", columns: [table["gameUid"]] }),
  uniqueIndex("repeat_name_PRIMARY_pad").on(sql.raw("rtrim(\"gameUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("repeat_name_server_index").on(sql.raw("rtrim(\"server\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("repeat_name_name_index").on(sql.raw("rtrim(\"gameUserName\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
