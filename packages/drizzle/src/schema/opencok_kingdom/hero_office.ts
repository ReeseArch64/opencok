import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const hero_office = opencok_kingdom.table("hero_office", {
  "id": integer("id").notNull(),
  "uid": varchar("uid", { length: 40 }).notNull(),
  "officeId": varchar("officeId", { length: 40 }),
  "position": integer("position").default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "lastRefreshExpTime": bigint("lastRefreshExpTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "hero_office_PRIMARY", columns: [table["id"], table["uid"]] }),
  index("hero_office_uid_index").on(sql.raw("\"uid\"")),
]);
