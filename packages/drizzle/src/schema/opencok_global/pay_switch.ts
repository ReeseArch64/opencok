import { integer, text } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const pay_switch = opencok_global.table("pay_switch", {
  "Id": integer("Id").notNull(),
  "status": integer("status"),
  "time": text("time"),
});
