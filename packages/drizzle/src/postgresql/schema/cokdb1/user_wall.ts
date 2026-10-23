// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_wall = cokdb1.table("user_wall", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "armyId": legacyText("armyId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "num": integer("num").notNull().default(sql.raw("0")),
  "build": integer("build").notNull().default(sql.raw("0")),
  "finishTime": bigint("finishTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "level": integer("level").notNull(),
}, (table) => [
  primaryKey({ name: "user_wall_PRIMARY", columns: [table["uid"], table["armyId"]] }),
  uniqueIndex("user_wall_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"armyId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
