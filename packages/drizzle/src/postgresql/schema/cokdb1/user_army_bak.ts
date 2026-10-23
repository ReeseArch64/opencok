// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_army_bak = cokdb1.table("user_army_bak", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "armyId": legacyText("armyId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "level": integer("level").notNull().default(sql.raw("0")),
  "free": integer("free").notNull().default(sql.raw("0")),
  "pve": integer("pve").notNull().default(sql.raw("0")),
  "march": integer("march").notNull().default(sql.raw("0")),
  "defence": integer("defence").notNull().default(sql.raw("0")),
  "train": integer("train").notNull().default(sql.raw("0")),
  "foodCostTime": bigint("foodCostTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "finishTime": bigint("finishTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_army_bak_PRIMARY", columns: [table["uid"], table["armyId"]] }),
  uniqueIndex("user_army_bak_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"armyId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
