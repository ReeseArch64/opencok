// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_territory_donate_resource = cokdb1.table("user_territory_donate_resource", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "stone": bigint("stone", { mode: "bigint" }).notNull(),
  "wood": bigint("wood", { mode: "bigint" }).notNull(),
  "iron": bigint("iron", { mode: "bigint" }).notNull(),
  "food": bigint("food", { mode: "bigint" }).notNull(),
  "sandStone": bigint("sandStone", { mode: "bigint" }).notNull(),
  "diamondStone": bigint("diamondStone", { mode: "bigint" }).notNull(),
  "marble": bigint("marble", { mode: "bigint" }).notNull(),
  "granite": bigint("granite", { mode: "bigint" }).notNull(),
  "limestone": bigint("limestone", { mode: "bigint" }).notNull(),
  "lastUpdateTime": bigint("lastUpdateTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "user_territory_donate_resource_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_territory_donate_resource_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
