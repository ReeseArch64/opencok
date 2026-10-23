// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const t_hero = cokdb1.table("t_hero", {
  "id": legacyText("id", {"sqlType":"character varying(36)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}),
  "heroid": integer("heroid"),
  "level": smallint("level"),
  "exp": integer("exp"),
  "events": legacyText("events", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "createtime": bigint("createtime", { mode: "bigint" }),
  "state": smallint("state"),
  "skinID": legacyText("skinID", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "t_hero_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("t_hero_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("t_hero_Index_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("t_hero_state_range", sql.raw("\"state\" BETWEEN -128 AND 127")),
]);
