// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_dragon_battle = cokdb1.table("alliance_dragon_battle", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "joinMemberCnt": integer("joinMemberCnt").default(sql.raw("0")),
  "leftTeleportTimes": integer("leftTeleportTimes"),
}, (table) => [
  primaryKey({ name: "alliance_dragon_battle_PRIMARY", columns: [table["allianceId"]] }),
  uniqueIndex("alliance_dragon_battle_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
