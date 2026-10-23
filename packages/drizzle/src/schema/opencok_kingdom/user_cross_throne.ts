import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_cross_throne = opencok_kingdom.table(
  "user_cross_throne",
  {
    "id": integer("id")
      .notNull()
      .generatedByDefaultAsIdentity({ "name": "user_cross_throne_id_seq", "startWith": 2347 }),
    "uid": varchar("uid", { length: 128 }),
    "totalKills": bigint("totalKills", { mode: "bigint" }).default(sql.raw("0")),
    "totalDeads": bigint("totalDeads", { mode: "bigint" }),
    "kingdomFightIndex": integer("kingdomFightIndex"),
    "startTime": bigint("startTime", { mode: "bigint" }),
    "name": varchar("name", { length: 128 }),
    "allianceName": varchar("allianceName", { length: 128 }),
    "abbr": varchar("abbr", { length: 128 }),
    "kingdomName": varchar("kingdomName", { length: 128 }),
    "serverId": integer("serverId"),
    "deadDetail": varchar("deadDetail", { length: 1024 }),
    "deadDetailBak": varchar("deadDetailBak", { length: 1024 }),
    "hasCemeteryCollected": bigint("hasCemeteryCollected", { mode: "bigint" }).default(
      sql.raw("0"),
    ),
  },
  (table) => [primaryKey({ name: "user_cross_throne_PRIMARY", columns: [table["id"]] })],
);
