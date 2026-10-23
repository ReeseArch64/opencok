import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_title = opencok_kingdom.table("alliance_title", {
  "allianceId": varchar("allianceId", { length: 40 }).notNull(),
  "title": integer("title").notNull(),
  "uid": varchar("uid", { length: 255 }),
  "uName": varchar("uName", { length: 255 }),
  "applicant": varchar("applicant", { length: 500 }),
}, (table) => [
  primaryKey({ name: "alliance_title_PRIMARY", columns: [table["allianceId"], table["title"]] }),
]);
