import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const rob_general = opencok_kingdom.table("rob_general", {
  "uid": varchar("uid", { length: 96 }),
  "serverid": integer("serverid"),
  "allianceid": varchar("allianceid", { length: 96 }),
  "alliancename": varchar("alliancename", { length: 255 }),
  "owneruid": varchar("owneruid", { length: 96 }).notNull().default(sql.raw("''")),
  "ownername": varchar("ownername", { length: 255 }),
  "generalid": integer("generalid").notNull().default(sql.raw("0")),
  "robtime": bigint("robtime", { mode: "bigint" }),
  "freetime": bigint("freetime", { mode: "bigint" }),
  "optime": varchar("optime", { length: 200 }),
}, (table) => [
  primaryKey({ name: "rob_general_PRIMARY", columns: [table["owneruid"], table["generalid"]] }),
]);
