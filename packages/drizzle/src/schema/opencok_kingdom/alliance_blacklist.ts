import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_blacklist = opencok_kingdom.table(
  "alliance_blacklist",
  {
    "allianceId": varchar("allianceId", { length: 40 }).notNull(),
    "black": varchar("black", { length: 500 }),
    "white": varchar("white", { length: 500 }),
  },
  (table) => [primaryKey({ name: "alliance_blacklist_PRIMARY", columns: [table["allianceId"]] })],
);
