// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_weakness_building = cokdb1.table("user_weakness_building", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "armyId": legacyText("armyId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "weakness": integer("weakness").notNull().default(sql.raw("0")),
  "marchWeakness": integer("marchWeakness").notNull(),
  "heal": integer("heal").notNull().default(sql.raw("0")),
  "finishTime": bigint("finishTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_weakness_building_PRIMARY", columns: [table["uid"], table["armyId"]] }),
  uniqueIndex("user_weakness_building_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"armyId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
