import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const ob_record = cokdb1.table("ob_record", {
  "uid": varchar("uid", { length: 50 }).notNull(),
  "allianceIds": varchar("allianceIds", { length: 200 }).notNull(),
  "begin": bigint("begin", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "serverId": integer("serverId").notNull().default(sql.raw("0")),
  "areaId": integer("areaId").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "ob_record_PRIMARY", columns: [table["uid"], table["allianceIds"]] }),
  index("ob_record_uid").on(sql.raw("\"uid\""), sql.raw("\"serverId\""), sql.raw("\"areaId\"")),
]);
