import { bigint, integer, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const luck_draw_history = opencok_kingdom.table("luck_draw_history", {
    "gameUid": varchar("gameUid", { length: 255 }),
    "roleName": varchar("roleName", { length: 40 }),
    "allianceId": varchar("allianceId", { length: 40 }),
    "allianceName": varchar("allianceName", { length: 40 }),
    "type": integer("type"),
    "itemId": varchar("itemId", { length: 255 }),
    "time": bigint("time", { mode: "bigint" }),
});
