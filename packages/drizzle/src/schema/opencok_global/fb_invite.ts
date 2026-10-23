import { bigint, primaryKey } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const fb_invite = opencok_global.table(
  "fb_invite",
  {
    "fid": bigint("fid", { mode: "bigint" }).notNull(),
    "tid": bigint("tid", { mode: "bigint" }).notNull(),
    "time": bigint("time", { mode: "bigint" }).notNull(),
  },
  (table) => [primaryKey({ name: "fb_invite_PRIMARY", columns: [table["fid"], table["tid"]] })],
);
