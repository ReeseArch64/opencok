// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_hospital = cokdb1.table("user_hospital", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "armyId": legacyText("armyId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "dead": integer("dead").notNull().default(sql.raw("0")),
  "heal": integer("heal").notNull().default(sql.raw("0")),
  "finishTime": bigint("finishTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_hospital_PRIMARY", columns: [table["uid"], table["armyId"]] }),
  uniqueIndex("user_hospital_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"armyId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
