import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const fight_king_status = opencok_kingdom.table("fight_king_status", {
  "index": integer("index").notNull(),
  "info": varchar("info", { length: 8192 }),
}, (table) => [
  primaryKey({ name: "fight_king_status_PRIMARY", columns: [table["index"]] }),
]);
