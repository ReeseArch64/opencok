import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_totem = opencok_kingdom.table(
  "user_totem",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "totemId": integer("totemId").notNull(),
    "putTime": bigint("putTime", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({ name: "user_totem_PRIMARY", columns: [table["uid"], table["totemId"]] }),
  ],
);
