// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_monster_siege = cokdb1.table("user_monster_siege", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"C"}).notNull(),
  "failTimes": integer("failTimes").default(sql.raw("0")),
  "killMonsterCount": bigint("killMonsterCount", { mode: "bigint" }).default(sql.raw("0")),
  "state": integer("state").notNull(),
  "goalRank": integer("goalRank").default(sql.raw("0")),
  "failRounds": legacyText("failRounds", {"sqlType":"character varying(100)","collation":"C"}),
  "isfinish": integer("isfinish").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_monster_siege_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_monster_siege_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
  index("user_monster_siege_state_index").on(sql.raw("\"state\"")),
]);
