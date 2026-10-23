import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const player = cokdb1.table("player", {
  "id": varchar("id", { length: 8 }).notNull(),
  "name": varchar("name", { length: 255 }).notNull(),
}, (table) => [
  primaryKey({ name: "player_PRIMARY", columns: [table["id"]] }),
]);
