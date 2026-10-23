// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const world_favorite = cokdb1.table("world_favorite", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "point": integer("point").notNull(),
  "type": integer("type").notNull(),
  "cityType": integer("cityType").default(sql.raw("-1")),
  "resType": integer("resType").default(sql.raw("-1")),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "server": integer("server").notNull().default(sql.raw("0")),
  "createTime": bigint("createTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "world_favorite_PRIMARY", columns: [table["uid"], table["point"], table["server"]] }),
  uniqueIndex("world_favorite_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"point\""), sql.raw("\"server\"")),
  index("world_favorite_time_idx").on(sql.raw("\"createTime\"")),
]);
