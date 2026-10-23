import { sql } from "drizzle-orm";
import { bigint, integer, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const ad_building_attachment = cokdb1.table("ad_building_attachment", {
  "uuid": varchar("uuid", { length: 36 }).notNull(),
  "serverid": integer("serverid"),
  "skillid": integer("skillid"),
  "cdtime": bigint("cdtime", { mode: "bigint" }),
  "skillstate": integer("skillstate"),
  "donateresource": varchar("donateresource", { length: 300 }),
}, (_table) => [
  uniqueIndex("ad_building_attachment_uss_index").on(sql.raw("\"uuid\""), sql.raw("\"serverid\""), sql.raw("\"skillid\"")),
]);
