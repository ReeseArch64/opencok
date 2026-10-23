import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const worldcup_apply = opencok_kingdom.table(
  "worldcup_apply",
  {
    "allianceId": varchar("allianceId", { length: 50 }).notNull(),
    "version": integer("version").notNull(),
    "applyUid": varchar("applyUid", { length: 50 }),
    "serverId": integer("serverId"),
    "time": bigint("time", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({
      name: "worldcup_apply_PRIMARY",
      columns: [table["allianceId"], table["version"]],
    }),
  ],
);
