// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_fight_of_king = cokdb1.table("alliance_fight_of_king", {
  "type": integer("type").notNull(),
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "serverId": integer("serverId").notNull(),
  "occupyTime": bigint("occupyTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "alliance_fight_of_king_PRIMARY", columns: [table["type"], table["id"]] }),
  uniqueIndex("alliance_fight_of_king_PRIMARY_pad").on(sql.raw("\"type\""), sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
