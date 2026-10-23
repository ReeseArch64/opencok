// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const cross_throne_king_info = cokdb1.table("cross_throne_king_info", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(50)","collation":"C"}).notNull(),
  "version": integer("version").notNull(),
  "king_type": integer("king_type").notNull(),
  "config_type": integer("config_type").notNull(),
  "name": legacyText("name", {"sqlType":"character varying(50)","collation":"C"}),
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"C"}),
  "pic": legacyText("pic", {"sqlType":"character varying(50)","collation":"C"}),
  "pic_ver": integer("pic_ver").notNull().default(sql.raw("0")),
  "king_server_id": integer("king_server_id").notNull().default(sql.raw("0")),
  "alliance_abbr": legacyText("alliance_abbr", {"sqlType":"character varying(50)","collation":"C"}),
  "occupy_seconds": integer("occupy_seconds").notNull().default(sql.raw("0")),
  "induction_time": bigint("induction_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "throne_dead_count": integer("throne_dead_count").notNull().default(sql.raw("0")),
  "trebuchet_dead_count": integer("trebuchet_dead_count").notNull().default(sql.raw("0")),
  "battle_user_count": integer("battle_user_count").notNull().default(sql.raw("0")),
  "battle_alliance_count": integer("battle_alliance_count").notNull().default(sql.raw("0")),
  "scout_count": integer("scout_count").notNull().default(sql.raw("0")),
  "create_time": bigint("create_time", { mode: "bigint" }),
  "last_update_time": bigint("last_update_time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "cross_throne_king_info_PRIMARY", columns: [table["version"], table["king_type"], table["config_type"]] }),
  uniqueIndex("cross_throne_king_info_uuid").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"C\"")),
]);
