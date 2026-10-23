import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const auction_server_group = opencok_global.table(
  "auction_server_group",
  {
    "id": integer("id").notNull(),
    "zoneIdStr": varchar("zoneIdStr", { length: 2000 }).notNull(),
  },
  (table) => [primaryKey({ name: "auction_server_group_PRIMARY", columns: [table["id"]] })],
);
