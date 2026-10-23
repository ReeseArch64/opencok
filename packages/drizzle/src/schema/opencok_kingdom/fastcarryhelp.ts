import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const fastcarryhelp = opencok_kingdom.table("fastcarryhelp", {
  "allianceId": varchar("allianceId", { length: 40 }).notNull(),
  "uid": varchar("uid", { length: 255 }).notNull(),
  "maxcount": integer("maxcount").notNull().default(sql.raw("0")),
  "nowcount": integer("nowcount").notNull().default(sql.raw("0")),
  "helpers": varchar("helpers", { length: 2048 }),
  "updatetime": bigint("updatetime", { mode: "bigint" }).notNull(),
  "progress": integer("progress").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "fastcarryhelp_PRIMARY", columns: [table["allianceId"], table["uid"]] }),
]);
