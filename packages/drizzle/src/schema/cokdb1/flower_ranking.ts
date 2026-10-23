import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const flower_ranking = cokdb1.table("flower_ranking", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "scoreVal": integer("scoreVal"),
  "flowerVal": integer("flowerVal"),
  "eggVal": integer("eggVal"),
  "hideKing": integer("hideKing").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "flower_ranking_PRIMARY", columns: [table["uid"]] }),
]);
