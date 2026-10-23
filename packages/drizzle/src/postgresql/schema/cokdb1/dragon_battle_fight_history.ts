// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_battle_fight_history = cokdb1.table("dragon_battle_fight_history", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"C"}).notNull(),
  "teamId": legacyText("teamId", {"sqlType":"character varying(50)","collation":"C"}),
  "type": integer("type").notNull(),
  "time": bigint("time", { mode: "bigint" }),
  "serverId": integer("serverId"),
  "VERSION": legacyText("VERSION", {"sqlType":"character varying(50)","collation":"C"}).default(sql.raw("''")),
  "indexId": integer("indexId"),
  "score": integer("score"),
  "id": legacyText("id", {"sqlType":"character varying(50)","collation":"C"}).notNull(),
  "param1": legacyText("param1", {"sqlType":"character varying(255)","collation":"C"}).default(sql.raw("''")),
  "seasonVersion": integer("seasonVersion").notNull().default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "dragon_battle_fight_history_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("dragon_battle_fight_history_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"C\"")),
  index("dragon_battle_fight_history_utvindex").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("\"type\""), sql.raw("rtrim(\"VERSION\", ' ') COLLATE \"C\"")),
  index("dragon_battle_fight_history_teamIdindex").on(sql.raw("rtrim(\"teamId\", ' ') COLLATE \"C\"")),
]);
