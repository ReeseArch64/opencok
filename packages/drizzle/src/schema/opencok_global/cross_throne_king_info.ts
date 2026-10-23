import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const cross_throne_king_info = opencok_global.table(
  "cross_throne_king_info",
  {
    "uuid": varchar("uuid", { length: 50 }).notNull(),
    "version": integer("version").notNull().default(sql.raw("0")),
    "king_type": integer("king_type").notNull().default(sql.raw("0")),
    "config_type": integer("config_type").notNull().default(sql.raw("0")),
    "name": varchar("name", { length: 50 }),
    "uid": varchar("uid", { length: 50 }),
    "pic": varchar("pic", { length: 50 }),
    "pic_ver": integer("pic_ver").notNull().default(sql.raw("0")),
    "king_server_id": integer("king_server_id").notNull().default(sql.raw("0")),
    "alliance_abbr": varchar("alliance_abbr", { length: 50 }),
    "occupy_seconds": integer("occupy_seconds").notNull().default(sql.raw("0")),
    "induction_time": bigint("induction_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "throne_dead_count": integer("throne_dead_count").notNull().default(sql.raw("0")),
    "trebuchet_dead_count": integer("trebuchet_dead_count").notNull().default(sql.raw("0")),
    "battle_user_count": integer("battle_user_count").notNull().default(sql.raw("0")),
    "battle_alliance_count": integer("battle_alliance_count").notNull().default(sql.raw("0")),
    "scout_count": integer("scout_count").notNull().default(sql.raw("0")),
    "create_time": bigint("create_time", { mode: "bigint" }),
    "last_update_time": bigint("last_update_time", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({
      name: "cross_throne_king_info_PRIMARY",
      columns: [table["config_type"], table["king_type"], table["version"]],
    }),
    uniqueIndex("cross_throne_king_info_uuid").on(sql.raw('"uuid"')),
  ],
);
