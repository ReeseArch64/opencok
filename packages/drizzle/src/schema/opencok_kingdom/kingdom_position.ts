import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const kingdom_position = opencok_kingdom.table("kingdom_position", {
  "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
  "positionId": varchar("positionId", { length: 40 }).notNull().default(sql.raw("''")),
  "time": bigint("time", { mode: "bigint" }),
  "chNameFlag": integer("chNameFlag"),
  "preKingUid": varchar("preKingUid", { length: 40 }),
  "relinquishEndTime": bigint("relinquishEndTime", { mode: "bigint" }),
  "currResourceType": integer("currResourceType"),
  "chBannerFlag": integer("chBannerFlag"),
  "chThronePicFlag": integer("chThronePicFlag"),
  "appointedTime": bigint("appointedTime", { mode: "bigint" }).default(sql.raw("0")),
  "valid": integer("valid").default(sql.raw("0")),
  "cemeteryBlessTime": bigint("cemeteryBlessTime", { mode: "bigint" }).default(sql.raw("0")),
  "serverId": integer("serverId").default(sql.raw("0")),
  "isSmall": integer("isSmall").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "kingdom_position_PRIMARY", columns: [table["uid"]] }),
]);
