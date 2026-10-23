import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const auction = cokdb_global.table("auction", {
  "uuid": varchar("uuid", { length: 255 }).notNull().default(sql.raw("''")),
  "groupId": integer("groupId").notNull(),
  "cfgId": varchar("cfgId", { length: 30 }).notNull(),
  "itemId": varchar("itemId", { length: 20 }).notNull(),
  "num": integer("num").notNull(),
  "color": integer("color").notNull(),
  "endTime": bigint("endTime", { mode: "bigint" }).notNull(),
  "zoneId": integer("zoneId"),
  "uid": varchar("uid", { length: 255 }),
  "name": varchar("name", { length: 255 }),
  "price": integer("price").notNull(),
  "add": integer("add").notNull(),
  "decision": integer("decision").notNull(),
  "end": integer("end").notNull(),
  "type": integer("type").notNull(),
}, (table) => [
  primaryKey({ name: "auction_PRIMARY", columns: [table["uuid"]] }),
]);
