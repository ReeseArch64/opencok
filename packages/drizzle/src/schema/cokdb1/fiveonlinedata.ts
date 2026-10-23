import { sql } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const fiveonlinedata = cokdb1.table("fiveonlinedata", {
  "timeStamp": integer("timeStamp").notNull().default(sql.raw("0")),
  "count": integer("count"),
}, (table) => [
  primaryKey({ name: "fiveonlinedata_PRIMARY", columns: [table["timeStamp"]] }),
]);
