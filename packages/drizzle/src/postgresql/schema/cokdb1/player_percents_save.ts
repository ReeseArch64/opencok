// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const player_percents_save = cokdb1.table("player_percents_save", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "footEffect": legacyNumber("footEffect", {"sqlType":"real"}).notNull().default(sql.raw("0")),
  "rideEffect": legacyNumber("rideEffect", {"sqlType":"real"}).notNull().default(sql.raw("0")),
  "bowEffect": legacyNumber("bowEffect", {"sqlType":"real"}).notNull().default(sql.raw("0")),
  "carEffect": legacyNumber("carEffect", {"sqlType":"real"}).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "player_percents_save_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("player_percents_save_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
