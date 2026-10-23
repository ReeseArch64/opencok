import { sql } from "drizzle-orm";
import { primaryKey, real, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const player_percents_save = opencok_kingdom.table("player_percents_save", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "footEffect": real("footEffect").notNull().default(sql.raw("0")),
  "rideEffect": real("rideEffect").notNull().default(sql.raw("0")),
  "bowEffect": real("bowEffect").notNull().default(sql.raw("0")),
  "carEffect": real("carEffect").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "player_percents_save_PRIMARY", columns: [table["uid"]] }),
]);
