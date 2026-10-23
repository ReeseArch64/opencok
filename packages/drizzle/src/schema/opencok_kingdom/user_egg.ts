import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_egg = opencok_kingdom.table("user_egg", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "eggId": varchar("eggId", { length: 10 }).notNull(),
  "goods": varchar("goods", { length: 200 }).notNull(),
  "reward": integer("reward").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_egg_PRIMARY", columns: [table["uid"], table["eggId"]] }),
]);
