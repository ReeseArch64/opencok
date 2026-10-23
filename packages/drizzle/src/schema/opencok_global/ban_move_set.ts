import { varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const ban_move_set = opencok_global.table("ban_move_set", {
  "country": varchar("country", { length: 256 }),
  "pf": varchar("pf", { length: 255 }),
  "serverPf": varchar("serverPf", { length: 255 }),
  "sid": varchar("sid", { length: 255 }),
  "val": varchar("val", { length: 255 }),
});
