// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const fb_friend = cokdb_global.table("fb_friend", {
  "fid": bigint("fid", { mode: "bigint" }).notNull(),
  "tid": bigint("tid", { mode: "bigint" }).notNull(),
  "tserver": integer("tserver"),
  "tuid": legacyText("tuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "fb_friend_PRIMARY", columns: [table["fid"], table["tid"]] }),
]);
