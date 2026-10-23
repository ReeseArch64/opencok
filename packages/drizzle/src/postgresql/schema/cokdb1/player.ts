// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const player = cokdb1.table("player", {
  "id": legacyText("id", {"sqlType":"character varying(8)","collation":"legacy_meta.ci"}).notNull(),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
}, (table) => [
  primaryKey({ name: "player_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("player_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
