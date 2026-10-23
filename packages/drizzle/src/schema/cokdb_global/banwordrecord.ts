import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const banwordrecord = cokdb_global.table("banwordrecord", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "server": integer("server").notNull(),
  "banTimes": integer("banTimes").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "banwordrecord_PRIMARY", columns: [table["uid"], table["server"]] }),
]);
