import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_dragon_battle = opencok_kingdom.table(
  "alliance_dragon_battle",
  {
    "allianceId": varchar("allianceId", { length: 40 }).notNull(),
    "joinMemberCnt": integer("joinMemberCnt").default(sql.raw("0")),
    "leftTeleportTimes": integer("leftTeleportTimes"),
  },
  (table) => [
    primaryKey({ name: "alliance_dragon_battle_PRIMARY", columns: [table["allianceId"]] }),
  ],
);
