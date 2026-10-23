// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_territory_resource = cokdb1.table("user_territory_resource", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(255)","collation":"C"}),
  "wood": bigint("wood", { mode: "bigint" }).default(sql.raw("0")),
  "stone": bigint("stone", { mode: "bigint" }).default(sql.raw("0")),
  "iron": bigint("iron", { mode: "bigint" }).default(sql.raw("0")),
  "food": bigint("food", { mode: "bigint" }).default(sql.raw("0")),
  "silver": bigint("silver", { mode: "bigint" }).default(sql.raw("0")),
  "lastUpdateTime": bigint("lastUpdateTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_territory_resource_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_territory_resource_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
  index("user_territory_resource_al_idx").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"C\"")),
]);
