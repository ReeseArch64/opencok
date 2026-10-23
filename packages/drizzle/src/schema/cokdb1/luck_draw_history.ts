import { bigint, integer, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const luck_draw_history = cokdb1.table("luck_draw_history", {
  "gameUid": varchar("gameUid", { length: 255 }),
  "roleName": varchar("roleName", { length: 40 }),
  "allianceId": varchar("allianceId", { length: 40 }),
  "allianceName": varchar("allianceName", { length: 40 }),
  "type": integer("type"),
  "itemId": varchar("itemId", { length: 255 }),
  "time": bigint("time", { mode: "bigint" }),
});
