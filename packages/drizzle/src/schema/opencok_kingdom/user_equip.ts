import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_equip = opencok_kingdom.table(
  "user_equip",
  {
    "uuid": varchar("uuid", { length: 255 }).notNull(),
    "uid": varchar("uid", { length: 255 }).notNull(),
    "on": integer("on").notNull().default(sql.raw("0")),
    "generalid": integer("generalid").default(sql.raw("0")),
    "itemId": integer("itemId").notNull().default(sql.raw("0")),
    "cost": varchar("cost", { length: 255 }).default(sql.raw("''")),
    "extraProperty": varchar("extraProperty", { length: 255 }).default(sql.raw("''")),
    "refineProperty": varchar("refineProperty", { length: 255 }).default(sql.raw("''")),
    "lockProperty": varchar("lockProperty", { length: 255 }),
    "showSign": integer("showSign").default(sql.raw("1")),
    "reforgeCount": integer("reforgeCount").default(sql.raw("0")),
    "strengthLevel": integer("strengthLevel").notNull().default(sql.raw("0")),
    "crystalCharge": integer("crystalCharge").notNull().default(sql.raw("0")),
    "darkCrystalCharge": integer("darkCrystalCharge").notNull().default(sql.raw("0")),
    "chargeType": integer("chargeType").notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "user_equip_PRIMARY", columns: [table["uuid"]] }),
    index("user_equip_index_uid_on").on(sql.raw('"uid"'), sql.raw('"on"')),
  ],
);
