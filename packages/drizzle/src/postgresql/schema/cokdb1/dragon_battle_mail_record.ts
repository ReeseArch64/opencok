// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_battle_mail_record = cokdb1.table("dragon_battle_mail_record", {
  "season_version": integer("season_version").notNull(),
  "version": integer("version").notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "teamId": legacyText("teamId", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "fightServer": integer("fightServer").notNull().default(sql.raw("0")),
  "score": integer("score").notNull().default(sql.raw("0")),
  "mailId": integer("mailId").notNull().default(sql.raw("0")),
  "teamScore": integer("teamScore").notNull().default(sql.raw("0")),
  "rewards": legacyText("rewards", {"sqlType":"character varying(2000)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''''''")),
  "recived": smallint("recived").notNull().default(sql.raw("0")),
  "state": integer("state").notNull().default(sql.raw("0")),
  "win": smallint("win").notNull().default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "dragon_battle_mail_record_PRIMARY", columns: [table["uid"], table["season_version"], table["version"]] }),
  uniqueIndex("dragon_battle_mail_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"season_version\""), sql.raw("\"version\"")),
  index("dragon_battle_mail_record_state").on(sql.raw("\"state\"")),
  check("dragon_battle_mail_record_recived_range", sql.raw("\"recived\" BETWEEN -128 AND 127")),
  check("dragon_battle_mail_record_win_range", sql.raw("\"win\" BETWEEN -128 AND 127")),
]);
