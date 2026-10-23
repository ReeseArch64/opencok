import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const cross_info = opencok_kingdom.table(
  "cross_info",
  {
    "uid": varchar("uid", { length: 128 }).notNull().default(sql.raw("''")),
    "changeServerType": varchar("changeServerType", { length: 128 }),
    "crossTime": bigint("crossTime", { mode: "bigint" }).default(sql.raw("0")),
    "targetServerId": integer("targetServerId").default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "cross_info_PRIMARY", columns: [table["uid"]] })],
);
