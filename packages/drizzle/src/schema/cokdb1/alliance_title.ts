import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_title = cokdb1.table("alliance_title", {
  "allianceId": varchar("allianceId", { length: 40 }).notNull(),
  "title": integer("title").notNull(),
  "uid": varchar("uid", { length: 255 }),
  "uName": varchar("uName", { length: 255 }),
  "applicant": varchar("applicant", { length: 500 }),
}, (table) => [
  primaryKey({ name: "alliance_title_PRIMARY", columns: [table["allianceId"], table["title"]] }),
]);
