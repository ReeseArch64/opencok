import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const invest_everyday = opencok_kingdom.table(
  "invest_everyday",
  {
    "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
    "tableid": integer("tableid").notNull(),
    "level": integer("level").notNull(),
    "isreceive": varchar("isreceive", { length: 128 }).notNull().default(sql.raw("''")),
    "beginTime": bigint("beginTime", { mode: "bigint" }).default(sql.raw("0")),
    "receiveTime": bigint("receiveTime", { mode: "bigint" }).default(sql.raw("0")),
    "endactive": integer("endactive").default(sql.raw("0")),
    "promptTime": bigint("promptTime", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "invest_everyday_PRIMARY", columns: [table["uid"]] })],
);
