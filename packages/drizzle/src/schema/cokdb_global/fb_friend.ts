import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const fb_friend = cokdb_global.table("fb_friend", {
  "fid": bigint("fid", { mode: "bigint" }).notNull(),
  "tid": bigint("tid", { mode: "bigint" }).notNull(),
  "tserver": integer("tserver"),
  "tuid": varchar("tuid", { length: 40 }),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "fb_friend_PRIMARY", columns: [table["fid"], table["tid"]] }),
]);
