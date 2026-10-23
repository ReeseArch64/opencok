import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const server_top_score = opencok_kingdom.table("server_top_score", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "actId": varchar("actId", { length: 40 }).notNull(),
  "round": integer("round").default(sql.raw("0")),
  "score": integer("score").default(sql.raw("0")),
  "rank": integer("rank").default(sql.raw("0")),
  "name": varchar("name", { length: 40 }),
  "allianceAbbr": varchar("allianceAbbr", { length: 40 }),
  "allianceIcon": varchar("allianceIcon", { length: 40 }),
}, (table) => [
  primaryKey({ name: "server_top_score_PRIMARY", columns: [table["uid"], table["actId"]] }),
]);
