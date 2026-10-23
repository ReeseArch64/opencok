import { sql } from "drizzle-orm";
import { check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const contact_fb = opencok_kingdom.table("contact_fb", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "friendUid": varchar("friendUid", { length: 255 }).notNull(),
  "fbUid": varchar("fbUid", { length: 255 }).notNull(),
  "stat": integer("stat").default(sql.raw("0")),
  "description": bytea("description"),
  "fbName": bytea("fbName"),
}, (table) => [
  primaryKey({ name: "contact_fb_PRIMARY", columns: [table["uid"], table["friendUid"]] }),
  check("contact_fb_description_length", sql.raw("octet_length(\"description\") <= 65535")),
  check("contact_fb_fbName_length", sql.raw("octet_length(\"fbName\") <= 65535")),
]);
