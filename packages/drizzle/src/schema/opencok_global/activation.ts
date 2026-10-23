import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const activation = opencok_global.table(
  "activation",
  {
    "code": varchar("code", { length: 40 }).notNull(),
    "series": integer("series"),
    "type": integer("type").default(sql.raw("0")),
    "user": varchar("user", { length: 40 }),
    "useTime": bigint("useTime", { mode: "bigint" }),
    "state": integer("state").default(sql.raw("0")),
    "timeId": integer("timeId").default(sql.raw("0")),
    "count": integer("count").default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "activation_PRIMARY", columns: [table["code"]] }),
    index("activation_index_user").on(sql.raw('"user"')),
  ],
);
