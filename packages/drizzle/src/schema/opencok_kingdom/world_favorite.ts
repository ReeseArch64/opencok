import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const world_favorite = opencok_kingdom.table(
  "world_favorite",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "point": integer("point").notNull(),
    "type": integer("type").notNull(),
    "cityType": integer("cityType").default(sql.raw("-1")),
    "resType": integer("resType").default(sql.raw("-1")),
    "name": varchar("name", { length: 255 }),
    "server": integer("server").notNull().default(sql.raw("0")),
    "createTime": bigint("createTime", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [
    primaryKey({
      name: "world_favorite_PRIMARY",
      columns: [table["uid"], table["point"], table["server"]],
    }),
    index("world_favorite_time_idx").on(sql.raw('"createTime"')),
  ],
);
