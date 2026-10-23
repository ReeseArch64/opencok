import { integer, text } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const pay_switch = cokdb_global.table("pay_switch", {
  "Id": integer("Id").notNull(),
  "status": integer("status"),
  "time": text("time"),
});
