import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, text } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const kingdom_info = cokdb1.table("kingdom_info", {
  "serverId": integer("serverId").notNull(),
  "wood": bigint("wood", { mode: "bigint" }).default(sql.raw("0")),
  "food": bigint("food", { mode: "bigint" }).default(sql.raw("0")),
  "iron": bigint("iron", { mode: "bigint" }).default(sql.raw("0")),
  "stone": bigint("stone", { mode: "bigint" }).default(sql.raw("0")),
  "silver": bigint("silver", { mode: "bigint" }).default(sql.raw("0")),
  "victoryTowerLevel": integer("victoryTowerLevel").notNull().default(sql.raw("1")),
  "expeditionUserCount": integer("expeditionUserCount").default(sql.raw("0")),
  "expeditionKillArmyCount": bigint("expeditionKillArmyCount", { mode: "bigint" }).default(sql.raw("0")),
  "expeditionKillMonsterCount": integer("expeditionKillMonsterCount").default(sql.raw("0")),
  "expeditionCollectCount": bigint("expeditionCollectCount", { mode: "bigint" }).default(sql.raw("0")),
  "isOccupyThrone": smallint("isOccupyThrone").default(sql.raw("0")),
  "throneScore": integer("throneScore").default(sql.raw("0")),
  "expeditionKingdomScore": integer("expeditionKingdomScore").default(sql.raw("0")),
  "kingdomMiracleLevel": integer("kingdomMiracleLevel").default(sql.raw("0")),
  "ownerMiracles": text("ownerMiracles"),
  "miracleOccupyCount": integer("miracleOccupyCount").default(sql.raw("0")),
  "isMyThroneOccupy": smallint("isMyThroneOccupy").default(sql.raw("0")),
  "isOccupyOtherThrone": smallint("isOccupyOtherThrone").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "kingdom_info_PRIMARY", columns: [table["serverId"]] }),
  check("kingdom_info_isOccupyThrone_range", sql.raw("\"isOccupyThrone\" BETWEEN -128 AND 127")),
  check("kingdom_info_isMyThroneOccupy_range", sql.raw("\"isMyThroneOccupy\" BETWEEN -128 AND 127")),
  check("kingdom_info_isOccupyOtherThrone_range", sql.raw("\"isOccupyOtherThrone\" BETWEEN -128 AND 127")),
]);
