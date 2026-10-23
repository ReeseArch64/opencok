// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_equip = cokdb1.table("user_equip", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "on": integer("on").notNull().default(sql.raw("0")),
  "generalid": integer("generalid").default(sql.raw("0")),
  "itemId": integer("itemId").notNull().default(sql.raw("0")),
  "cost": legacyText("cost", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "extraProperty": legacyText("extraProperty", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "refineProperty": legacyText("refineProperty", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "lockProperty": legacyText("lockProperty", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "showSign": integer("showSign").default(sql.raw("1")),
  "reforgeCount": integer("reforgeCount").default(sql.raw("0")),
  "strengthLevel": integer("strengthLevel").notNull().default(sql.raw("0")),
  "crystalCharge": integer("crystalCharge").notNull().default(sql.raw("0")),
  "darkCrystalCharge": integer("darkCrystalCharge").notNull().default(sql.raw("0")),
  "chargeType": integer("chargeType").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_equip_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_equip_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_equip_index_uid_on").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"on\"")),
]);
