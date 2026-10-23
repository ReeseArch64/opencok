import { sql } from "drizzle-orm";
import { primaryKey, real, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const player_percents_save = cokdb1.table("player_percents_save", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "footEffect": real("footEffect").notNull().default(sql.raw("0")),
  "rideEffect": real("rideEffect").notNull().default(sql.raw("0")),
  "bowEffect": real("bowEffect").notNull().default(sql.raw("0")),
  "carEffect": real("carEffect").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "player_percents_save_PRIMARY", columns: [table["uid"]] }),
]);
