import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const userbindmapping_oldbigone = cokdb_global.table("userbindmapping_oldbigone", {
  "gameUid": varchar("gameUid", { length: 100 }).notNull(),
  "mappingType": varchar("mappingType", { length: 20 }).notNull().default(sql.raw("''")),
  "mappingValue": varchar("mappingValue", { length: 200 }),
  "lastTime": bigint("lastTime", { mode: "bigint" }).default(sql.raw("0")),
  "active": integer("active").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "userbindmapping_oldbigone_PRIMARY", columns: [table["gameUid"], table["mappingType"]] }),
  index("userbindmapping_oldbigone_pf_pi_lasttime_index").on(sql.raw("\"mappingType\""), sql.raw("\"mappingValue\""), sql.raw("\"lastTime\"")),
]);
