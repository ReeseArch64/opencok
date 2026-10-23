import { sql } from "drizzle-orm";
import { check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_vedio = cokdb1.table("alliance_vedio", {
  "allianceId": varchar("allianceId", { length: 40 }).notNull(),
  "vedioURL": varchar("vedioURL", { length: 200 }),
  "thumbnailURL": varchar("thumbnailURL", { length: 200 }),
  "vedioW": integer("vedioW").notNull().default(sql.raw("0")),
  "vedioH": integer("vedioH").notNull().default(sql.raw("0")),
  "vedioSize": integer("vedioSize").notNull().default(sql.raw("0")),
  "vedioLength": integer("vedioLength").notNull().default(sql.raw("0")),
  "checkSign": smallint("checkSign").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_vedio_PRIMARY", columns: [table["allianceId"]] }),
  check("alliance_vedio_checkSign_range", sql.raw("\"checkSign\" BETWEEN -128 AND 127")),
]);
