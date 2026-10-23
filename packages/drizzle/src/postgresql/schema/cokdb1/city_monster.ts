// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const city_monster = cokdb1.table("city_monster", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.sv_ci"}).notNull(),
  "nextUpdateTime": bigint("nextUpdateTime", { mode: "bigint" }),
  "bigMonster": integer("bigMonster"),
  "smallMonster": integer("smallMonster"),
  "lastUpdateTime": bigint("lastUpdateTime", { mode: "bigint" }),
  "bigMonsterInOneDay": integer("bigMonsterInOneDay"),
}, (table) => [
  primaryKey({ name: "city_monster_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("city_monster_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"sv_ci\"")),
]);
