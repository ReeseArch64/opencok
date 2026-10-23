import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const foreigen_sciences = opencok_kingdom.table(
  "foreigen_sciences",
  {
    "uid": varchar("uid", { length: 32 }).notNull(),
    "itemid": integer("itemid").notNull(),
    "level": integer("level"),
    "cdtime": bigint("cdtime", { mode: "bigint" }),
    "reserve": integer("reserve"),
  },
  (table) => [
    primaryKey({ name: "foreigen_sciences_PRIMARY", columns: [table["uid"], table["itemid"]] }),
  ],
);
