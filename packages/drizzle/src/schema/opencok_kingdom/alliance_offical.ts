import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_offical = opencok_kingdom.table("alliance_offical", {
  "allianceId": varchar("allianceId", { length: 40 }).notNull(),
  "officalOneUid": varchar("officalOneUid", { length: 40 }).notNull().default(sql.raw("''")),
  "officalTwoUid": varchar("officalTwoUid", { length: 40 }).notNull().default(sql.raw("''")),
  "officalThreeUid": varchar("officalThreeUid", { length: 40 }).notNull().default(sql.raw("''")),
  "officalFourUid": varchar("officalFourUid", { length: 40 }).notNull().default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "alliance_offical_PRIMARY", columns: [table["allianceId"]] }),
]);
