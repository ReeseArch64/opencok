import { bigint, primaryKey } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const fb_bind = opencok_global.table("fb_bind", {
  "fbid": bigint("fbid", { mode: "bigint" }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "fb_bind_PRIMARY", columns: [table["fbid"]] }),
]);
