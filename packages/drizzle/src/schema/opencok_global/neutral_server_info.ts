import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const neutral_server_info = opencok_global.table("neutral_server_info", {
  "serverId": integer("serverId").notNull(),
  "groupId": integer("groupId").notNull(),
  "stateId": integer("stateId").notNull().default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
  "ownerServerId": integer("ownerServerId").default(sql.raw("0")),
  "open": smallint("open").default(sql.raw("0")),
  "resType": integer("resType").default(sql.raw("0")),
  "awardTime": bigint("awardTime", { mode: "bigint" }),
  "isKickFinish": integer("isKickFinish"),
  "resTypeList": varchar("resTypeList", { length: 255 }),
}, (table) => [
  primaryKey({ name: "neutral_server_info_PRIMARY", columns: [table["serverId"]] }),
  check("neutral_server_info_open_range", sql.raw("\"open\" BETWEEN -128 AND 127")),
]);
