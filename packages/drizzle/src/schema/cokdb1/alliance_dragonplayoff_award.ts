import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_dragonplayoff_award = cokdb1.table("alliance_dragonplayoff_award", {
  "version": integer("version").notNull(),
  "allianceId": varchar("allianceId", { length: 50 }).notNull(),
  "uid": varchar("uid", { length: 50 }).notNull(),
  "type": integer("type").notNull(),
  "state": integer("state").notNull(),
  "addr": varchar("addr", { length: 2000 }),
}, (table) => [
  primaryKey({ name: "alliance_dragonplayoff_award_PRIMARY", columns: [table["version"], table["allianceId"], table["uid"], table["type"]] }),
]);
