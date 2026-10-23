import { sql } from "drizzle-orm";
import { bigint, doublePrecision, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const civilization_castle = opencok_kingdom.table("civilization_castle", {
  "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
  "level": integer("level").default(sql.raw("0")),
  "pointId": integer("pointId").default(sql.raw("0")),
  "def": integer("def").default(sql.raw("0")),
  "resourceNum": doublePrecision("resourceNum"),
  "lastOutputTime": bigint("lastOutputTime", { mode: "bigint" }),
  "robCount": integer("robCount").default(sql.raw("0")),
  "beRobNum": integer("beRobNum").default(sql.raw("0")),
  "lastRefreshDataTime": bigint("lastRefreshDataTime", { mode: "bigint" }),
  "status": integer("status").default(sql.raw("0")),
  "buildTime": bigint("buildTime", { mode: "bigint" }),
  "lastSettleTime": bigint("lastSettleTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "civilization_castle_PRIMARY", columns: [table["uid"]] }),
]);
