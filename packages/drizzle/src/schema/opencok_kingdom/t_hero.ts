import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const t_hero = opencok_kingdom.table("t_hero", {
  "id": varchar("id", { length: 36 }).notNull(),
  "uid": varchar("uid", { length: 32 }),
  "heroid": integer("heroid"),
  "level": smallint("level"),
  "exp": integer("exp"),
  "events": text("events"),
  "createtime": bigint("createtime", { mode: "bigint" }),
  "state": smallint("state"),
  "skinID": varchar("skinID", { length: 255 }).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "t_hero_PRIMARY", columns: [table["id"]] }),
  index("t_hero_Index_uid").on(sql.raw("\"uid\"")),
  check("t_hero_state_range", sql.raw("\"state\" BETWEEN -128 AND 127")),
]);
