// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_world_pve = cokdb1.table("user_world_pve", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "pointId": integer("pointId").notNull(),
  "attNum": integer("attNum").notNull(),
  "buyNum": integer("buyNum"),
  "monsterInfo": legacyBytes("monsterInfo"),
}, (table) => [
  primaryKey({ name: "user_world_pve_PRIMARY", columns: [table["uid"], table["pointId"]] }),
  uniqueIndex("user_world_pve_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"pointId\"")),
  check("user_world_pve_monsterInfo_length", sql.raw("octet_length(\"monsterInfo\") <= 65535")),
]);
